"""
Attestor SSRF & Security Defense Layer (P0)
Guards server-side URL navigation against SSRF, cloud metadata exfiltration,
and malicious IP representations.
SPDX-License-Identifier: Apache-2.0
"""
import socket
import ipaddress
import urllib.parse
from typing import Tuple

BLOCKED_HOSTNAMES = {
    "localhost",
    "metadata.google.internal",
    "metadata",
    "instance-data",
    "kubernetes.default",
    "vault.local"
}

def is_ip_private_or_restricted(ip_str: str) -> bool:
    """Checks whether an IP address belongs to loopback, private, link-local, or multicast."""
    try:
        ip = ipaddress.ip_address(ip_str)
        return (
            ip.is_private or
            ip.is_loopback or
            ip.is_link_local or
            ip.is_multicast or
            ip.is_reserved or
            ip.is_unspecified
        )
    except ValueError:
        return False

def parse_alternative_ip_encoding(hostname: str) -> str:
    """Detects and normalizes decimal, hex, or octal IP encodings."""
    clean = hostname.strip().lower()
    
    # Check single integer decimal IP (e.g., 2130706433 -> 127.0.0.1)
    if clean.isdigit():
        try:
            num = int(clean)
            if 0 <= num <= 4294967295:
                return str(ipaddress.IPv4Address(num))
        except Exception:
            pass

    # Check hex or octal notation
    if clean.startswith("0x") or ".0x" in clean or ".0" in clean:
        parts = clean.split(".")
        if len(parts) == 4:
            try:
                dec_parts = []
                for p in parts:
                    if p.startswith("0x"):
                        dec_parts.append(str(int(p, 16)))
                    elif p.startswith("0") and len(p) > 1 and not p.startswith("0x"):
                        dec_parts.append(str(int(p, 8)))
                    else:
                        dec_parts.append(str(int(p)))
                return ".".join(dec_parts)
            except Exception:
                pass

    return clean

def validate_target_url(url: str, allow_zoo_testing: bool = False) -> Tuple[bool, str]:
    """
    Validates target URL against SSRF and cloud metadata exfiltration.
    Returns (is_safe: bool, reason: str).
    """
    if not url or not isinstance(url, str):
        return False, "Target URL must be a non-empty string"

    try:
        parsed = urllib.parse.urlparse(url)
    except Exception as e:
        return False, f"Invalid URL structure: {e}"

    scheme = parsed.scheme.lower()
    if scheme not in ("http", "https"):
        return False, f"Prohibited URL scheme '{scheme}'. Only HTTP and HTTPS are permitted."

    hostname = (parsed.hostname or "").strip().lower()
    if not hostname:
        return False, "Target URL missing valid hostname"

    # Normalize alternative IP encodings (decimal, hex, octal)
    normalized_host = parse_alternative_ip_encoding(hostname)

    # Allow local Zoo test suite when explicitly permitted
    if allow_zoo_testing and hostname in ("127.0.0.1", "localhost") and parsed.port == 8899:
        return True, "Permitted Zoo test fixture endpoint"

    # Check blocked hostnames
    if normalized_host in BLOCKED_HOSTNAMES:
        return False, f"Target hostname '{hostname}' is blocked for security (prohibited host/cloud metadata)."

    # Check direct IP address literal
    if is_ip_private_or_restricted(normalized_host):
        return False, f"Target IP '{normalized_host}' falls in private, loopback, or link-local range (SSRF blocked)."

    # Resolve DNS to check underlying IP
    try:
        addr_info = socket.getaddrinfo(hostname, None)
        for _, _, _, _, sockaddr in addr_info:
            resolved_ip = sockaddr[0]
            if is_ip_private_or_restricted(resolved_ip):
                return False, f"Target hostname '{hostname}' resolves to restricted IP '{resolved_ip}' (SSRF blocked)."
    except socket.gaierror:
        # Unresolvable domains cannot be fetched
        return False, f"Target hostname '{hostname}' cannot be resolved by DNS"
    except Exception as e:
        return False, f"DNS resolution failed: {e}"

    return True, "URL verified safe"
