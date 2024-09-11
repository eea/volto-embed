import {
  CREATE_CONTENT,
  UPDATE_CONTENT,
} from '@plone/volto/constants/ActionTypes';

const cleanAction = (action) => {
  if (action?.request?.data?.maps) {
    const mapVisualizationData = {
      ...action.request.data.maps,
    };
    if (mapVisualizationData.preview && mapVisualizationData.preview_url_loaded)
      delete mapVisualizationData.preview;
    delete mapVisualizationData.preview_url_loaded;

    return {
      ...action,
      request: {
        ...action.request,
        data: {
          ...action.request.data,

          maps: mapVisualizationData,
        },
      },
    };
  } else return action;
};

export const preview_image = (middlewares) => [
  (store) => (next) => async (action) => {
    if (![CREATE_CONTENT, UPDATE_CONTENT].includes(action.type)) {
      return next(action);
    }
    const state = store.getState();
    const contentData = state.content.data;
    const lastPreviewImage = Object.keys(action?.request?.data).includes(
      'preview_image',
    )
      ? action?.request?.data.preview_image
      : contentData?.preview_image;
    const type = action?.request?.data?.['@type'] || contentData['@type'];

    if (
      !contentData ||
      type !== 'map_interactive' ||
      contentData.preview_image_saved ||
      !action?.request?.data?.maps?.preview
    ) {
      return next(cleanAction(action));
    }

    if (
      lastPreviewImage &&
      lastPreviewImage.filename !==
        'preview_image_generated_map_interactive.png'
    ) {
      return next(cleanAction(action));
    }

    try {
      const previewImage = {
        preview_image: {
          data: action.request.data.maps.preview.split(',')[1],
          encoding: 'base64',
          'content-type': 'image/png',
          filename: 'preview_image_generated_map_interactive.png',
        },
        preview_image_saved: true,
      };

      const mapVisualizationData = {
        ...action.request.data.maps,
      };
      delete mapVisualizationData.preview;
      delete mapVisualizationData.preview_url_loaded;

      return next({
        ...action,
        request: {
          ...action.request,
          data: {
            ...action.request.data,
            ...previewImage,
            maps: mapVisualizationData,
          },
        },
      });
    } catch (error) {
      return next(action);
    }
  },
  ...middlewares,
];
