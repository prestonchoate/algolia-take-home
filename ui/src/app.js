const { algoliasearch, instantsearch } = window;
const { autocomplete } = window['@algolia/autocomplete-js'];
const { createLocalStorageRecentSearchesPlugin } =
  window['@algolia/autocomplete-plugin-recent-searches'];
const { createQuerySuggestionsPlugin } =
  window['@algolia/autocomplete-plugin-query-suggestions'];

// This is not a good idea for security and in a production app you'd want to not send this to the browser
const searchClient = algoliasearch(
  'S3YV6U2M36',
  'bdd655079504ba836659abffd6e6adec'
);

const search = instantsearch({
  indexName: 'product_catalog',
  searchClient,
  future: { preserveSharedStateOnUnmount: true },
  insights: true,
});

const virtualSearchBox = instantsearch.connectors.connectSearchBox(() => {});

const labelMapping = {
  true: 'Yes',
  false: 'No',
};

search.addWidgets([
  virtualSearchBox({}),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components }) => html`
        <div>
          <img src="${hit.image}" align="left" alt="${hit.name}" />
          <div class="hit-name">
            ${components.Highlight({ hit, attribute: 'name' })}
          </div>
          <div class="hit-description">
            ${components.Highlight({ hit, attribute: 'description' })}
          </div>
          <div class="hit-price">$${hit.price}</div>
        </div>
      `,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
  instantsearch.widgets.clearRefinements({
    container: '#clear-refinements',
  }),

  instantsearch.widgets.refinementList({
    container: '#brand-list',
    attribute: 'brand',
    showMore: true,
    searchable: true,
    searchablePlaceholder: 'Search our brands',
  }),

  instantsearch.widgets.refinementList({
    container: '#price-list',
    attribute: 'price_range',
    showMore: true,
  }),

  instantsearch.widgets.hierarchicalMenu({
    container: '#category-list',
    attributes: [
      'hierarchicalCategories.lvl0',
      'hierarchicalCategories.lvl1',
      'hierarchicalCategories.lvl2',
    ],
    showMore: true,
  }),

  instantsearch.widgets.ratingMenu({
    container: '#rating-list',
    attribute: 'rating',
  }),

  instantsearch.widgets.refinementList({
    container: '#free-ship-list',
    attribute: 'free_shipping',
    transformItems(items) {
      return items.map((item) => ({
        ...item,
        highlighted: item.value == 'true' ? 'Yes' : 'No',
      }));
    },
  }),
]);

search.start();

const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: 'instantsearch',
  limit: 3,
  transformSource({ source }) {
    return {
      ...source,
      onSelect({ setIsOpen, setQuery, item, event }) {
        onSelect({ setQuery, setIsOpen, event, query: item.label });
      },
    };
  },
});

const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: 'product_catalog_query_suggestions',
  getSearchParams() {
    return recentSearchesPlugin.data.getAlgoliaSearchParams({ hitsPerPage: 6 });
  },
  transformSource({ source }) {
    return {
      ...source,
      sourceId: 'querySuggestionsPlugin',
      onSelect({ setIsOpen, setQuery, event, item }) {
        onSelect({ setQuery, setIsOpen, event, query: item.query });
      },
      getItems(params) {
        if (!params.state.query) {
          return [];
        }

        return source.getItems(params);
      },
    };
  },
});

autocomplete({
  container: '#searchbox',
  openOnFocus: true,
  detachedMediaQuery: 'none',
  onSubmit({ state }) {
    setInstantSearchUiState({ query: state.query });
  },
  plugins: [recentSearchesPlugin, querySuggestionsPlugin],
});

function setInstantSearchUiState(indexUiState) {
  search.mainIndex.setIndexUiState({ page: 1, ...indexUiState });
}

function onSelect({ setIsOpen, setQuery, event, query }) {
  if (isModifierEvent(event)) {
    return;
  }

  setQuery(query);
  setIsOpen(false);
  setInstantSearchUiState({ query });
}

function isModifierEvent(event) {
  const isMiddleClick = event.button === 1;

  return (
    isMiddleClick ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}
