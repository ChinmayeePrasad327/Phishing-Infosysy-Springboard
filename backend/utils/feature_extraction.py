import re
from urllib.parse import urlparse

def extract_features(url):
    """
    Extracts structural features from a URL string for ML inference.
    Matching the 13 features used in the training dataset.
    """
    # Clean URL: remove protocols and www
    clean_url = url.lower()
    clean_url = clean_url.replace("http://", "").replace("https://", "").replace("www.", "")
    
    hostname = ""
    nb_subdomains = 0
    length_hostname = 0

    try:
        parsed = urlparse("http://" + clean_url)
        hostname = parsed.netloc
        length_hostname = len(hostname)
        nb_subdomains = hostname.count('.')
    except Exception:
        pass

    features = {
        'length_url': len(clean_url),
        'length_hostname': length_hostname,
        'ip': 1 if re.match(r'\d+\.\d+\.\d+\.\d+', clean_url) else 0,
        'nb_dots': clean_url.count('.'),
        'nb_hyphens': clean_url.count('-'),
        'nb_at': clean_url.count('@'),
        'nb_qm': clean_url.count('?'),
        'nb_and': clean_url.count('&'),
        'nb_eq': clean_url.count('='),
        'nb_slash': clean_url.count('/'),
        'nb_digits': sum(c.isdigit() for c in clean_url),
        'sus_words': sum(w in clean_url for w in ['login', 'secure', 'verify', 'bank', 'update', 'account', 'free']),
        'nb_subdomains': nb_subdomains
    }
    
    return features

def get_feature_list():
    """Returns the ordered list of feature names used during training."""
    return [
        'length_url', 'length_hostname', 'ip', 'nb_dots', 'nb_hyphens', 
        'nb_at', 'nb_qm', 'nb_and', 'nb_eq', 'nb_slash', 'nb_digits', 
        'sus_words', 'nb_subdomains'
    ]
