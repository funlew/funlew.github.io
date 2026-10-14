const { Component } = require('inferno');
const { URL } = require('url');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

/**
 * Normalise a mapping value into either a single entry or a group of entries.
 *
 * The upstream widget only accepts a URL string or an object carrying a "link"
 * key, which leaves no way to nest entries under a heading. An object without
 * a "link" key is therefore read as a group, and its keys become the names of
 * the entries nested under that heading.
 *
 * @param {string|Object} value Value of a key in the "links" mapping
 * @returns {Object|null} { link, hideHostname }, { group }, or null if unusable
 */
function normalize(value) {
    if (typeof value === 'string') {
        return { link: value };
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (typeof value.link === 'string') {
            return { link: value.link, hideHostname: value.hide_hostname === true };
        }
        return Object.keys(value).length ? { group: value } : null;
    }
    return null;
}

/**
 * Hostname shown in the right hand tag, or null when the entry hides it or the
 * URL cannot be parsed.
 */
function hostnameOf(entry) {
    if (entry.hideHostname) {
        return null;
    }
    try {
        return new URL(entry.link).hostname;
    } catch (e) {
        return null;
    }
}

/**
 * External links widget JSX component.
 *
 * Extends the upstream component with support for grouping entries under a
 * second level heading. Plain entries keep rendering exactly as before.
 */
class Links extends Component {
    renderEntry(name, value) {
        const entry = normalize(value);
        if (!entry) {
            return null;
        }
        if (entry.group) {
            const children = Object.keys(entry.group)
                .map(child => this.renderEntry(child, entry.group[child]))
                .filter(child => child);
            if (!children.length) {
                return null;
            }
            return <li class="links-group">
                <span class="menu-label links-group-label">{name}</span>
                <ul class="menu-list">{children}</ul>
            </li>;
        }
        const hostname = hostnameOf(entry);
        return <li>
            <a class="level is-mobile" href={entry.link} target="_blank" rel="noopener">
                <span class="level-left">
                    <span class="level-item">{name}</span>
                </span>
                {hostname ? <span class="level-right">
                    <span class="level-item tag">{hostname}</span>
                </span> : null}
            </a>
        </li>;
    }

    render() {
        const { title, links } = this.props;
        const entries = Object.keys(links)
            .map(name => this.renderEntry(name, links[name]))
            .filter(entry => entry);
        if (!entries.length) {
            return null;
        }
        return <div class="card widget" data-type="links">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <ul class="menu-list">{entries}</ul>
                </div>
            </div>
        </div>;
    }
}

Links.Cacheable = cacheComponent(Links, 'widget.links', props => {
    const { helper, widget } = props;
    const links = widget.links || {};
    if (!Object.keys(links).length) {
        return null;
    }
    return {
        title: helper.__('widget.links'),
        links
    };
});

module.exports = Links;
