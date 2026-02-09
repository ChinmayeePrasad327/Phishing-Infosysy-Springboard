import re
import math
import collections
import pandas as pd
from urllib.parse import urlparse
from sklearn.base import BaseEstimator, TransformerMixin

KNOWN_BRANDS = [
    'google', 'wikipedia', 'netflix', 'leetcode', 'microsoft', 'apple', 'amazon', 
    'facebook', 'instagram', 'twitter', 'linkedin', 'github', 'paypal', 'dropbox', 
    'adobe', 'googlecloud', 'aws', 'azure', 'salesforce', 'slack', 'zoom'
]
SUSPICIOUS_TLDS = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq', '.icu', '.wang', '.bid', '.casa', '.viajes', '.fit']
COMMON_TLDS = ['.com', '.org', '.net', '.edu', '.gov', '.io', '.me', '.app', '.co']
SUS_KEYWORDS = ['login', 'verify', 'account', 'secure', 'update', 'banking', 'signin']
SECURE_ALLOWLIST = [
    "wikipedia.org", "google.com", "github.com", "microsoft.com", "apple.com",
    "leetcode.com", "netflix.com", "amazon.com", "linkedin.com", "twitter.com",
    "facebook.com", "instagram.com", "stackoverflow.com", "youtube.com", "bit.ly"
]

def get_entropy(u):
    p, l = collections.Counter(str(u)), float(len(str(u)))
    return -sum(count/l * math.log(count/l, 2) for count in p.values()) if l > 0 else 0

class URLFeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.feature_names = [
            'length_url', 'length_hostname', 'ip', 'nb_dots', 'nb_hyphens', 
            'nb_at', 'nb_qm', 'nb_and', 'nb_eq', 'nb_slash', 'nb_digits', 
            'nb_subdomains', 'domain_length', 'is_common_tld', 'is_suspicious_tld', 
            'is_known_brand_domain', 'brand_domain_mismatch', 'shannon_entropy', 
            'digit_ratio', 'symbol_ratio', 'vowel_consonant_ratio', 
            'sus_keyword_near_brand', 'nb_meaningful_tokens', 'login_verify_near_brand',
            'is_trusted_domain', 'is_standard_path', 'is_https', 'dot_ratio'
        ]

    def fit(self, X, y=None):
        return self

    def _extract_one(self, url):
        features = {}
        try:
            url = str(url).lower()
            if not url: raise ValueError("Empty URL")
            
            # Robust Parsing
            if '://' not in url:
                url_for_parsing = 'http://' + url
            else:
                url_for_parsing = url
                
            try:
                parsed = urlparse(url_for_parsing)
                netloc = parsed.netloc
                path = parsed.path
                scheme = parsed.scheme
            except:
                cleaned = url_for_parsing.split('://')[-1]
                netloc = cleaned.split('/')[0]
                path = '/' + '/'.join(cleaned.split('/')[1:]) if '/' in cleaned else ''
                scheme = url_for_parsing.split('://')[0]

            # 1. Structural
            features['length_url'] = len(url)
            features['length_hostname'] = len(netloc)
            features['ip'] = 1 if re.search(r'\d+\.\d+\.\d+\.\d+', netloc) else 0
            features['nb_dots'] = url.count('.')
            features['nb_hyphens'] = url.count('-')
            features['nb_at'] = url.count('@')
            features['nb_qm'] = url.count('?')
            features['nb_and'] = url.count('&')
            features['nb_eq'] = url.count('=')
            features['nb_slash'] = url.count('/')
            features['nb_digits'] = len(re.findall(r'\d', url))
            features['nb_subdomains'] = max(0, netloc.count('.') - 1)
            
            # 2. Domain Context
            features['domain_length'] = len(netloc)
            tld = '.' + netloc.split('.')[-1] if '.' in netloc else ''
            features['is_common_tld'] = 1 if tld in COMMON_TLDS else 0
            features['is_suspicious_tld'] = 1 if tld in SUSPICIOUS_TLDS else 0
            
            brand_found = None
            for brand in KNOWN_BRANDS:
                if brand in netloc:
                    brand_found = brand
                    break
            features['is_known_brand_domain'] = 1 if brand_found else 0
            
            features['brand_domain_mismatch'] = 0
            for brand in KNOWN_BRANDS:
                if brand in path:
                    if brand not in netloc:
                        features['brand_domain_mismatch'] = 1
                    break

            # 3. Randomness
            features['shannon_entropy'] = get_entropy(url)
            features['digit_ratio'] = features['nb_digits'] / len(url) if len(url) > 0 else 0
            features['symbol_ratio'] = (url.count('.') + url.count('-') + url.count('_') + url.count('/')) / len(url) if len(url) > 0 else 0
            vowels = len(re.findall(r'[aeiou]', url))
            cons = len(re.findall(r'[bcdfghjklmnpqrstvwxyz]', url))
            features['vowel_consonant_ratio'] = vowels / cons if cons > 0 else 0

            # 4. Semantic
            sus_near_brand = 0
            if brand_found:
                for keyword in SUS_KEYWORDS:
                    if keyword in url:
                        sus_near_brand = 1
                        break
            features['sus_keyword_near_brand'] = sus_near_brand
            
            tokens = re.split(r'[./\-_?&=]', url)
            tokens = [t for t in tokens if t]
            features['nb_meaningful_tokens'] = len(tokens)
            
            login_near = 1 if any(k in url for k in ['login', 'verify', 'update']) else 0
            features['login_verify_near_brand'] = login_near
            
            # --- New Probabilistic Bias Signals ---
            domain = netloc.replace('www.', '').strip()
            features['is_trusted_domain'] = 1 if any(domain == d or domain.endswith('.' + d) for d in SECURE_ALLOWLIST) else 0
            
            features['is_standard_path'] = 1 if len(path) < 30 and path.count('/') < 4 else 0
            features['is_https'] = 1 if scheme == 'https' else 0
            features['dot_ratio'] = features['nb_dots'] / len(url) if len(url) > 0 else 0

        except:
            # Fallback to zeros but ensure all keys exist
            features = {f: 0 for f in self.feature_names}
        
        return features

    def transform(self, X):
        if isinstance(X, str):
            X = [X]
        data = [self._extract_one(url) for url in X]
        return pd.DataFrame(data, columns=self.feature_names)

def extract_features_v3(url, model_prob=None):
    """
    Advanced Inference Bridge with Probabilistic Bias Correction (Part 2).
    This is NOT a hard allowlist, but applies mathematical bias to the 
    model's raw output based on high-confidence legitimacy signals.
    """
    extractor = URLFeatureExtractor()
    features = extractor._extract_one(url)
    
    # Probabilistic Bias Logic
    adjusted_prob = model_prob if model_prob is not None else 0.5
    
    # 1. Trusted Domain Bias (Significant reduction)
    if features.get('is_trusted_domain') == 1:
        adjusted_prob *= 0.15  # Scale down significantly
        
    # 2. Structural Sanity Bias
    if features.get('is_standard_path') == 1 and features.get('nb_dots', 0) <= 2:
        adjusted_prob *= 0.8
        
    # 3. IP/Suspicious TLD Penalty (Strong increase if not trusted)
    if features.get('is_trusted_domain') == 0:
        if features.get('ip') == 1 or features.get('is_suspicious_tld') == 1:
            adjusted_prob = max(adjusted_prob, 0.75)

    return features, adjusted_prob

def extract_features_v2(url):
    """Legacy bridge for app.py"""
    extractor = URLFeatureExtractor()
    return extractor._extract_one(url)
