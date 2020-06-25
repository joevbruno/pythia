import { isNotEmpty } from '@/utils'

export function FeaturesModule(featureFlagService) {
  const getDefaultState = () => ({
    data: {
      features: [],
      featureMap: {}
    }
  })

  const mapFeatures = features => features.reduce((map, item) => {
    map[item.name] = item.enabled

    return map
  }, {})

  return {
    namespaced: true,

    state: {
      ...getDefaultState()
    },

    mutations: {
      SET_FEATURES(state, { features, featureMap }) {
        state.data.features = features
        state.data.featureMap = featureMap
      }
    },

    actions: {
      async init({ commit, dispatch }) {
        /* istanbul ignore next */ // this functionality is already tested in the feature-service-client project
        const onFeatureDataUpdated = features => dispatch('featureDataUpdated', { features })
        featureFlagService.onDataUpdated = onFeatureDataUpdated

        try {
          const features = await featureFlagService.fetchToggles()
          const featureMap = mapFeatures(features)

          commit('SET_FEATURES', { features, featureMap })
        } catch (error) {
          commit('SET_FEATURES', { features: [], featureMap: {} })
        }
      },

      async featureDataUpdated({ commit }, { features }) {
        const featureMap = mapFeatures(features)

        commit('SET_FEATURES', { features, featureMap })
      },

      stopPolling() {
        featureFlagService.stopPolling()
      }
    },

    getters: {
      features: state => state.data.features,
      featureMap: state => state.data.featureMap,
      featureEnabled: state => flag => {
        const { features } = state.data

        const feature = features.find(f => f.name === flag)

        return isNotEmpty(feature) ? feature.enabled : false
      }
    }
  }
}
