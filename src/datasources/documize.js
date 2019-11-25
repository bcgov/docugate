/* eslint-disable require-jsdoc */
import {RESTDataSource} from 'apollo-datasource-rest';
import _ from 'lodash';
import config from '../../config/index.json';

class DocumizeRestAPI extends RESTDataSource {
  constructor({baseURL}) {
    super();

    this.baseURL = baseURL;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * formats search results to be consumed by the apollo api,
   * specifically it adds a path property that can point a user to the document within the documize instance
   * @param {Object} result the documize search result
   */
  reduceDocumizeSearch(result) {
    return ({
      ...result,
      url: `${this.baseURL}/s/${result.spaceId}/${result.spaceSlug}/d/${result.documentId}/${result.documentSlug}`,
    });
  }

  /**
   * Searches documize api
   * @param {String} keywords the search query
   * @param {Number} limit the search result limit, this does not pass a limit value to the documize
   * api
   * @param {Object} searchOptions based on the remaining properties passed in the search request
   * body
   * see https://docs.documize.com/s/WtXNJ7dMOwABe2UK/api/d/Wt8bAncHWQABMuOp/search
   */
  async search(keywords, limit = config.defaultResultLimit, searchOptions = config.defaultSearchOptions) {
    const data = await this.post('api/search', {
      keywords,
      ...searchOptions,
    });
    const uniqueSearchResult = _.uniqBy(data, 'documentId');

    return uniqueSearchResult.slice(0, limit).map(this.reduceDocumizeSearch.bind(this));
  }
}

export default DocumizeRestAPI;
