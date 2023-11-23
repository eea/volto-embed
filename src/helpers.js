import { pick } from 'lodash';

export function pickMetadata(content) {
  return {
    ...pick(content, [
      '@id',
      'title',
      'data_provenance',
      'figure_note',
      'other_organisations',
      'temporan_coverage',
      'publisher',
      'geo_coverage',
    ]),
  };
}
