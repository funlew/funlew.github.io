const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const UpstreamCategories = require('hexo-component-inferno/lib/view/widget/categories');

/**
 * Sort the top level categories by a hand picked order.
 *
 * The names listed in the "customOrder" widget option come first, in the
 * given order. Every other category keeps its default relative position (the
 * orderby of the widget, name ascending) and is placed after the listed ones,
 * so adding a category does not disturb the order already agreed upon.
 *
 * @param {Array} categories Categories sorted by the widget orderby
 * @param {string[]} [customOrder] Category names in display order
 * @returns {Array} Reordered categories
 */
function applyCustomOrder(categories, customOrder) {
    if (!Array.isArray(customOrder) || !customOrder.length) {
        return categories;
    }
    const rank = new Map(customOrder.map((name, index) => [name, index]));
    const fallback = customOrder.length;
    const rankOf = category => (rank.has(category.name) ? rank.get(category.name) : fallback);
    return categories.slice().sort((a, b) => rankOf(a) - rankOf(b));
}

/**
 * Categories widget with a configurable display order.
 *
 * The upstream component sorts each sibling group by the "orderBy" option
 * alone, which cannot express a hand picked order such as the one the
 * sidebar shows (网络安全, 投资研究, 日常随笔). This component inherits the
 * rendering from the upstream one and overrides the data preparation: the
 * top level categories are reordered according to the "customOrder" option,
 * while the nested ones keep the upstream behaviour.
 */
class Categories extends UpstreamCategories {}

Categories.Cacheable = cacheComponent(Categories, 'widget.categories', props => {
    const { page, helper, widget = {} } = props;
    const categories = widget.categories === undefined ? props.site.categories : widget.categories;
    const orderBy = widget.orderBy === undefined ? 'name' : widget.orderBy;
    const order = widget.order === undefined ? 1 : widget.order;
    const showCurrent = widget.showCurrent === undefined ? false : widget.showCurrent;
    const showCount = widget.showCount === undefined ? true : widget.showCount;

    if (!categories || !categories.length) {
        return null;
    }

    // The option is not passed down as a widget prop, so it stays unset
    const depth = parseInt(props.depth, 10);

    function prepareQuery(parent) {
        const query = {};
        if (parent) {
            query.parent = parent;
        } else {
            query.parent = { $exists: false };
        }
        const list = categories.find(query).sort(orderBy, order).filter(category => category.length).toArray();
        return parent ? list : applyCustomOrder(list, widget.customOrder);
    }

    function hierarchicalList(level, parent) {
        return prepareQuery(parent).map(category => {
            let children = [];
            if (!depth || level + 1 < depth) {
                children = hierarchicalList(level + 1, category._id);
            }
            let isCurrent = false;
            if (showCurrent && page) {
                for (let i = 0; i < category.length; i++) {
                    const post = category.posts.data[i];
                    if (post && post._id === page._id) {
                        isCurrent = true;
                        break;
                    }
                }
                // special case: category page
                isCurrent = isCurrent || !!(page.base && page.base.startsWith(category.path));
            }
            return {
                children,
                isCurrent,
                name: category.name,
                count: category.length,
                url: helper.url_for(category.path)
            };
        });
    }

    return {
        showCount,
        categories: hierarchicalList(0),
        title: helper._p('common.category', Infinity)
    };
});

module.exports = Categories;
