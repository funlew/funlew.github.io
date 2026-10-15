---
title: 冰山之下：那些没人认领的子域名，正在暴露你的基础设施
title_en: 'Beneath the Iceberg: Unclaimed Subdomains Are Exposing Your Infrastructure'
date: 2026-10-15 10:40:00
categories:
  - [网络安全, 信息搜集]
categories_en:
  - [Cybersecurity, Information Gathering]
tags:
  - 子域名枚举
  - 资产发现
  - 信息收集
  - OSINT
  - 攻击面
tags_en:
  - Subdomain Enumeration
  - Asset Discovery
  - Reconnaissance
  - OSINT
  - Attack Surface
cover: /_attach/cybersecurity/information-gathering/2026-10-15-subdomain-enumeration-asset-discovery-cover.jpg
thumbnail: /_attach/cybersecurity/information-gathering/2026-10-15-subdomain-enumeration-asset-discovery-cover.jpg
---

<div class="lang-block" data-lang="zh-CN" lang="zh-CN">

红队刚入场时手里没有内网权限，第一件事不是打官网，而是搞清楚目标在公网上到底暴露了什么。攻击者通常不会优先攻击每天有人维护的站点，而是先找那些企业自己都没发现、没登记、没防护的遗留资产。

<!-- more -->

## 一、资产冰山

把目标资产比作一座冰山：

- **水面之上**是每天被关注、有人维护的官网，例如 `www.example.com`；
- **水面之下**则可能是 API、开发环境、测试环境、VPN、旧系统、历史子域名、代码泄露、`.git` 目录或 Swagger 文档。

水面下的部分既不会有告警，也不会有负责人。资产发现真正要找的，就是这一部分。

## 二、被动发现：不触达目标就能铺开资产面

优先使用不会直接请求目标的收集方式，从公开数据中整理线索。

### 证书透明度日志（CT Log）

CT Log 可按根域名查询当前及历史证书记录，用于发现：

- 已下线或被遗忘的旧域名；
- 历史子域名；
- 证书 SAN 中包含的其他业务域名；
- 可能仍在解析或仍被使用的旧资产。

使用时要注意：

- 不要依赖单一 CT 数据源，应交叉比对多个来源；
- 证书中的通配符域名不一定对应真实业务；
- 非业务域名需要做归属确认与过滤；
- 历史证书里的域名尤其值得核实——其中可能存在已下线但仍可访问的系统。

### 搜索引擎语法

利用搜索引擎的索引能力寻找后台入口、API 文档、配置文件、备份文件、调试信息，以及被索引的敏感文件。

查询思路是把 `site:`、`filetype:`、`inurl:` 等语法与域名、敏感关键词、文件类型组合起来。可能命中后台页面、接口文档、`phpinfo` 或 `.env` 等内容，仅限对自有资产或明确授权的目标使用。

### 被动 DNS 与威胁情报

被动 DNS 记录了域名过去的解析情况，可用于还原历史 IP、观察业务线变化、识别基础设施迁移，发现那些已经更换解析但仍在使用的旧服务，补充常规扫描覆盖不到的资产。

### 代码托管平台与泄露线索

公开代码托管平台上可能暴露：source map、Swagger 或 API 文档、`.git` 目录、配置文件，以及代码中的内部地址与接口信息。这类线索能帮助发现域名之外的内部基础设施与资产关系。

### 被动发现流程

1. 从 CT、搜索引擎、被动 DNS、代码平台等来源收集信息；
2. 汇总成域名与子域名清单；
3. 尽量在不直接请求目标的前提下完成初步资产面构建。

## 三、主动枚举：补足被动发现的遗漏

被动收集无法覆盖全部资产。取得书面授权并明确范围后，可用主动方式验证候选子域名。

### 字典与命名规律

使用带业务和环境特征的字典做补全，例如：

```
admin  api  test  vpn  dev  old  staging  uat  portal  beta
```

还可以结合已发现的域名词根、年份、环境名称、品牌变体、历史项目名称，以及企业内部常见命名习惯。字典质量与派生规则会直接影响子域名覆盖率。

### 主动枚举的合规要求

主动枚举会向目标发送大量请求，可能触发 WAF 与风控系统，造成日志激增、影响业务，也可能暴露测试行为。因此需要：

- 取得书面授权；
- 明确测试范围；
- 控制请求速率；
- 保留授权与限速记录；
- 不对未授权目标执行。

### 泛解析的识别与过滤

若目标启用了 wildcard DNS，任意随机子域名都会被解析到同一 IP，造成大量误报。判断思路：

1. 查询一个确定不存在的随机子域名；
2. 若它同样返回有效解析结果，说明可能存在泛解析；
3. 继续比较响应 IP、SOA 等特征；
4. 过滤掉由泛解析产生的伪存活资产。

### DNSSEC 与区域枚举

若授权区域使用 DNSSEC 且采用 NSEC，理论上可以沿记录链做区域遍历。但 NSEC3 会对记录名称做哈希处理，遍历成本显著增加。实际适用范围有限，不能简单理解为可以方便地进行完整区域枚举。

## 四、聚合、去重与归因

收集信息只是第一步，确认哪些信息属于目标组织的真实资产才是关键。

### 三键归因

用三个维度互相印证：

| 维度 | 作用 |
| --- | --- |
| 域名 | 字面是否指向目标 |
| IP | 解析结果是否落在目标网络 |
| 归属 | 注册主体与组织信息是否一致 |

三者能相互印证时，才更可能是真实资产。只命中一个或两个维度时，更可能属于泛解析误报、CDN 或 WAF 的共享节点、云厂商共享地址、错别字或品牌仿冒域名，或是其他组织的共享基础设施。

### 常见误报处理

- **泛解析**：产生大量伪命中，需按上文方法过滤；
- **CDN / 云 WAF / Anycast**：不能直接等同于源站；
- **品牌变体与错别字域名**：需核实注册信息；
- **IPv6 资产**：在传统 IPv4 资产发现中容易遗漏，而被动 DNS 与证书记录是补充 IPv6 资产的重要渠道。

### 从注册主体反推资产

1. 查找同一主体注册的域名；
2. 查看这些域名解析到的 IP；
3. 根据 IP 判断 ASN 或网络归属；
4. 在授权范围内进一步分析相关网络暴露的服务。

同时要注意云厂商共享 ASN 会带来噪声，CDN 与 Anycast 会隐藏真实源站，不能仅凭 ASN 或 IP 归属就认定资产属于目标。

## 五、工具类型与适用阶段

原文未列举具体工具，而是按用途做了分类：

| 工具类型 | 主要用途 | 适用阶段 | 合规注意 |
| --- | --- | --- | --- |
| 多源聚合类 | 汇总 CT、搜索、被动 DNS 等来源 | 被动铺面 | 切换主动模式前需取得授权 |
| 被动快扫类 | 快速获取已知资产 | 快速建立资产面 | 应以被动方式为主 |
| 邮箱 / 主机类 | 辅助发现邮箱地址与主机名 | 人员与资产关联 | 注意数据范围与授权边界 |
| 解析验证类 | 批量判断候选子域名是否存活 | 主动验证阶段 | 请求量大，需授权与限速 |
| 关系图类 | 展示资产、主体与归属关系 | 归因阶段 | 需结合人工判断，不能只看图谱结果 |

工具本身不是关键，关键在于使用目的、授权范围、数据质量与后续归因。

## 六、蓝队可以优先自查的五件事

### 1. 拉取并核查 CT 日志

把历史证书中的旧域名与历史子域名逐一确认：是否仍属于企业、是否仍解析、是否仍可访问、是否存在未知业务、是否已下线但未清理。

### 2. 清理「影子子域」

重点检查测试环境、历史项目、已下线业务、无人维护的旧站点，以及仍指向内部或云资源的域名。这些域名可能没有专人维护，却仍暴露在公网。

### 3. 盘点废弃资产

特别关注旧 VPN、已停用系统、默认口令设备、遗留管理入口、不再使用的测试服务。它们容易被忽略，但仍可访问，可能成为攻击入口。

### 4. 建立资产台账

每新建一个子域名或公网服务都应登记：

| 登记项 | 说明 |
| --- | --- |
| 资产负责人 | 出了事找得到人 |
| 所属业务 | 用途与归属 |
| 创建时间 | 便于判断历史遗留 |
| 用途 | 业务或测试 |
| 计划下线时间 | 避免长期存在 |
| 当前状态 | 在用 / 废弃 / 高危 |
| 风险等级 | 优先级依据 |

避免出现「资产已经上线，却没人知道由谁负责」的情况。

### 5. 开启 DNS 与证书监控

对新出现的域名、证书与解析变化自动告警，目标是在企业自身发现之前尽早获知，及时确认新资产归属，并减少资产长期处于无人管理状态的可能。

## 七、授权演练流程

1. 对目标根域进行被动聚合；
2. 合并 CT、搜索引擎、被动 DNS 与代码平台信息；
3. 做去重与资产归因；
4. 在授权范围内以限速方式主动补全子域名；
5. 识别并过滤泛解析造成的误报；
6. 输出资产台账；
7. 将资产标记为「存活」「废弃」或「高危」。

复盘显示最需要优先处理的是废弃子域名、旧 VPN、遗留系统，以及无归属或无人维护的资产，随后应推动下线或隔离，并将新增资产纳入持续监控。整个过程应保留授权证明、请求限速记录与测试范围记录。

资产存活之后，还需要进一步做服务识别、组件与版本指纹识别、端口与服务暴露分析，以及资产责任归属判断。

## 声明

原文明确声明，内容仅用于已获得书面授权的安全测试与防御科普，不提供可直接执行的命令或脚本。请勿在未获授权的系统上进行任何测试。

原文：[你扫不到的资产，才是攻击者最先拿下的：子域名枚举与资产发现实战指南](https://mp.weixin.qq.com/s/syOAeDfi1sx8VdV1W0kkPA) —— 第五信源 · 情报站第 006 期

封面图：[Circuit Board Detail](https://gratisography.com/photo/circuit-board-background/) by Gratisography，依其 Free Photo License 使用

</div>

<div class="lang-block" data-lang="en" lang="en">

When a red team starts with no internal access, the first move is not to attack the main website but to figure out what the target actually exposes on the public internet. Attackers rarely go for the site that is maintained every day; they look for the leftover assets the company itself never noticed, never inventoried and never protected.

<!-- more -->

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

</div>

