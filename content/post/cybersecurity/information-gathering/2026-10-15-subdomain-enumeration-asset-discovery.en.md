---
title: "'Beneath the Iceberg: Unclaimed Subdomains Are Exposing Your Infrastructure'"
date: 2026-10-15T10:40:00+08:00
layout: "post"
categories:
  - "Cybersecurity"
tags:
  - "Subdomain Enumeration"
  - "Asset Discovery"
  - "Reconnaissance"
  - "OSINT"
  - "Attack Surface"
image: "img/post/cybersecurity/information-gathering/2026-10-15-subdomain-enumeration-asset-discovery-cover.jpg"
thumbnail: "img/post/cybersecurity/information-gathering/2026-10-15-subdomain-enumeration-asset-discovery-cover.jpg"
---

When a red team starts with no internal access, the first move is not to attack the main website but to figure out what the target actually exposes on the public internet. Attackers rarely go for the site that is maintained every day; they look for the leftover assets the company itself never noticed, never inventoried and never protected.


## 1. The Asset Iceberg

Think of the target's assets as an iceberg:

- **Above the waterline** sits the main website that gets attention and maintenance every day, such as `www.example.com`.
- **Below the waterline** may lie APIs, development and staging environments, VPNs, legacy systems, historical subdomains, leaked code, `.git` directories or Swagger docs.

Nothing below the waterline raises an alert or has an owner. That is exactly the part asset discovery is looking for.

## 2. Passive Discovery: Map the Surface Without Touching the Target

Start with collection methods that never send a request to the target, and piece the clues together from public data.

### Certificate Transparency Logs

CT logs can be queried by root domain for current and historical certificates, and they help you find:

- old domains that were taken down or simply forgotten;
- historical subdomains;
- other business domains listed in the SAN of a certificate;
- legacy assets that may still resolve or still be in use.

A few caveats:

- never rely on a single CT source; cross check several of them;
- a wildcard domain in a certificate does not necessarily map to a real business system;
- domains outside the business need ownership checks and filtering;
- domains from historical certificates deserve extra scrutiny: a system that was taken down but is still reachable may be hiding there.

### Search Engine Operators

Use the index of search engines to look for admin panels, API docs, configuration files, backups, debug output and indexed sensitive files.

The idea is to combine operators such as `site:`, `filetype:` and `inurl:` with the domain, sensitive keywords and file types. Hits may include admin pages, API references, `phpinfo` or `.env` files. Only use this on your own assets or targets you are explicitly authorized to test.

### Passive DNS and Threat Intelligence

Passive DNS records how a domain resolved in the past. It helps reconstruct historical IPs, watch business lines change, spot infrastructure migrations and find old services that still run even though their DNS records were changed, covering assets a regular scan never sees.

### Code Hosting Platforms and Leaked Clues

Public code hosting platforms can leak source maps, Swagger or API docs, `.git` directories, configuration files, and internal addresses and endpoints in the code. Such clues reveal internal infrastructure and asset relationships beyond the domain itself.

### The Passive Discovery Workflow

1. Collect information from CT logs, search engines, passive DNS, code platforms and similar sources.
2. Merge everything into a list of domains and subdomains.
3. Build the first version of the asset map without ever touching the target directly.

## 3. Active Enumeration: Fill the Gaps Passive Discovery Leaves

Passive collection never covers everything. Once you have written authorization and a clearly defined scope, active methods can verify candidate subdomains.

### Wordlists and Naming Patterns

Complete the list with a wordlist tailored to the business and its environments, for example:

```
admin  api  test  vpn  dev  old  staging  uat  portal  beta
```

Also combine discovered domain roots, years, environment names, brand variants, historical project names and the naming habits common inside the organization. The quality of the wordlist and the derivation rules directly determines the coverage of your subdomain list.

### Compliance Requirements for Active Enumeration

Active enumeration sends a large number of requests to the target. It may trip WAFs and risk controls, flood logs, affect the business and expose the testing itself. Therefore you need to:

- obtain written authorization;
- define the scope of testing;
- control the request rate;
- keep records of the authorization and the rate limits;
- never run it against targets you are not authorized to test.

### Spotting and Filtering Wildcard DNS

If the target has wildcard DNS enabled, any random subdomain resolves to the same IP, producing a flood of false positives. A way to check:

1. Query a random subdomain that certainly does not exist.
2. If it still resolves, wildcard DNS is likely in play.
3. Compare the responding IP, SOA records and other characteristics.
4. Filter out the false live assets the wildcard produces.

### DNSSEC and Zone Walking

If an authorized zone uses DNSSEC with NSEC, the record chain can in theory be walked. NSEC3, however, hashes the record names, which raises the cost of a walk considerably. Its practical use is limited; do not assume it gives you a convenient full zone enumeration.

## 4. Aggregation, Deduplication and Attribution

Collecting the information is only the first step; the key is confirming which of it belongs to the target organization's real estate.

### Three-Key Attribution

Cross check three dimensions against each other:

| Dimension | What it tells you |
| --- | --- |
| Domain | Does the name itself point at the target? |
| IP | Does it resolve into the target's network? |
| Ownership | Do the registrant and organization records match? |

Only when all three confirm each other is the asset likely to be real. When only one or two dimensions match, it is more likely a wildcard false positive, a shared CDN or WAF node, a cloud provider's shared address space, a typo or brand impersonation domain, or shared infrastructure belonging to another organization.

### Handling Common False Positives

- **Wildcard DNS**: produces many fake hits; filter them as described above.
- **CDN / cloud WAF / Anycast**: not the same thing as the origin server.
- **Brand variants and typo domains**: verify the registration records.
- **IPv6 assets**: easily missed by traditional IPv4-oriented discovery; passive DNS and certificate records are important sources for finding them.

### Working Backwards from the Registrant

1. Find the domains registered by the same entity.
2. Look at the IPs these domains resolve to.
3. Use the IPs to determine the ASN or network owner.
4. Within the authorized scope, analyze the services exposed on the related networks.

Keep in mind that shared cloud ASNs introduce noise, and CDNs and Anycast hide true origins. Never conclude that an asset belongs to the target from its ASN or IP ownership alone.

## 5. Tool Categories and When to Use Them

The source article does not name specific tools; it groups them by purpose:

| Tool category | Main use | Stage | Compliance notes |
| --- | --- | --- | --- |
| Multi-source aggregators | Collect CT logs, search engines, passive DNS and similar sources | Passive mapping | Authorization required before switching to active mode |
| Passive scanners | Quickly fetch known assets | Build a fast asset overview | Prefer passive techniques |
| Email / host tools | Help discover mail addresses and hostnames | Linking people to assets | Watch the data scope and authorization boundaries |
| Resolution checkers | Batch test whether candidate subdomains are live | Active verification | High request volume; authorization and rate limits required |
| Graph tools | Visualize assets, entities and ownership | Attribution | Combine with manual judgment; never trust the graph alone |

The tools are not the point. The purpose, the authorization scope, the data quality and the attribution afterwards are.

## 6. Five Things Blue Teams Should Check First

### 1. Pull and Review the CT Logs

Go through the old domains and historical subdomains from past certificates one by one: does the company still own them, do they still resolve, are they still reachable, do they host unknown business, were they taken down without being cleaned up?

### 2. Clean Up Shadow Subdomains

Focus on staging environments, historical projects, retired services, unmaintained old sites and domains that still point at internal or cloud resources. Nobody may be responsible for them, yet they remain exposed to the internet.

### 3. Take Stock of Abandoned Assets

Pay special attention to legacy VPNs, decommissioned systems, devices with default credentials, leftover admin portals and test services nobody uses anymore. They are easy to overlook, still reachable, and may become the way in.

### 4. Keep an Asset Register

Every new subdomain or public service should be recorded:

| Field | Description |
| --- | --- |
| Asset owner | Someone to call when things go wrong |
| Business unit | Purpose and ownership |
| Created | Helps identify historical leftovers |
| Purpose | Production or testing |
| Planned retirement | Avoids assets living on forever |
| Current state | Active / abandoned / critical |
| Risk level | Basis for prioritization |

Avoid the situation where an asset is live but nobody knows who owns it.

### 5. Turn On DNS and Certificate Monitoring

Set up alerts for new domains and certificates and for resolution changes. The goal is to learn about them early, confirm ownership promptly, and reduce the chance of assets sitting unmanaged for a long time.

## 7. An Authorized Exercise Playbook

1. Run passive aggregation on the target's root domain.
2. Merge CT logs, search engine results, passive DNS and code platform findings.
3. Deduplicate and attribute the assets.
4. Within the authorized scope, complete the subdomain list actively at a limited rate.
5. Identify and filter the false positives caused by wildcard DNS.
6. Produce the asset register.
7. Mark every asset as live, abandoned or critical.

Post-exercise reviews show that abandoned subdomains, legacy VPNs, leftover systems and unowned or unmaintained assets deserve the highest priority: push to retire or isolate them, and bring new assets under continuous monitoring. Keep the authorization records, the rate limit logs and the scope documentation throughout.

Once an asset is confirmed live, the next steps are service identification, component and version fingerprinting, port and service exposure analysis, and determining who is responsible for it.

## Disclaimer

The source article states clearly that the content is meant only for security testing with written authorization and for defensive education, and that it provides no ready-to-run commands or scripts. Never test systems you are not authorized to test.

Source: [你扫不到的资产，才是攻击者最先拿下的：子域名枚举与资产发现实战指南](https://mp.weixin.qq.com/s/syOAeDfi1sx8dV1W0kkPA) — 第五信源 · 情报站, issue 006

Cover: [Circuit Board Detail](https://gratisography.com/photo/circuit-board-background/) by Gratisography, used under its Free Photo License.
