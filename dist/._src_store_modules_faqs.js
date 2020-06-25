export const faqs = {
  namespaced: true,

  state: {
    faqs: {
      register: [
        {
          question: 'components.register.faqs.register.QUESTION1',
          answer: 'components.register.faqs.register.ANSWER1',
          linkLabel: 'components.register.faqs.register.ANSWER_1_LINK',
          link: 'https://support.amplifyexchange.com/hc/en-us/articles/360022504314-Trading-Limits-and-Verification-Tiers'
        },
        { question: 'components.register.faqs.register.QUESTION2', answer: 'components.register.faqs.register.ANSWER2' },
        { question: 'components.register.faqs.register.QUESTION3', answer: 'components.register.faqs.register.ANSWER3' }
      ],
      registerAuthenticate: [
        {
          question: 'components.register.faqs.register.QUESTION1',
          answer: 'components.register.faqs.register.ANSWER1',
          linkLabel: 'components.register.faqs.register.ANSWER_1_LINK',
          link: 'https://support.amplifyexchange.com/hc/en-us/articles/360022504314-Trading-Limits-and-Verification-Tiers'
        },
        { question: 'components.register.faqs.register.QUESTION2', answer: 'components.register.faqs.register.ANSWER2' },
        { question: 'components.register.faqs.register.QUESTION3', answer: 'components.register.faqs.register.ANSWER3' }
      ],
      registerProfile: [
        {
          question: 'components.register.faqs.register.QUESTION1',
          answer: 'components.register.faqs.register.ANSWER1',
          linkLabel: 'components.register.faqs.register.ANSWER_1_LINK',
          link: 'https://support.amplifyexchange.com/hc/en-us/articles/360022504314-Trading-Limits-and-Verification-Tiers'
        },
        { question: 'components.register.faqs.register.QUESTION2', answer: 'components.register.faqs.register.ANSWER2' },
        { question: 'components.register.faqs.register.QUESTION3', answer: 'components.register.faqs.register.ANSWER3' }
      ],
      registerGetVerified: [
        {
          question: 'components.register.faqs.register.QUESTION1',
          answer: 'components.register.faqs.register.ANSWER1',
          linkLabel: 'components.register.faqs.register.ANSWER_1_LINK',
          link: 'https://support.amplifyexchange.com/hc/en-us/articles/360022504314-Trading-Limits-and-Verification-Tiers'
        },
        { question: 'components.register.faqs.register.QUESTION2', answer: 'components.register.faqs.register.ANSWER2' },
        { question: 'components.register.faqs.register.QUESTION3', answer: 'components.register.faqs.register.ANSWER3' }
      ],
      registerFunding: [
        { question: 'components.register.faqs.registerFunding.QUESTION1', answer: 'components.register.faqs.registerFunding.ANSWER1' },
        { question: 'components.register.faqs.registerFunding.QUESTION2', answer: 'components.register.faqs.registerFunding.ANSWER2' },
        { question: 'components.register.faqs.registerFunding.QUESTION3', answer: 'components.register.faqs.registerFunding.ANSWER3' }
      ],
      registerFundingFiat: [
        { question: 'components.register.faqs.registerFunding.QUESTION1', answer: 'components.register.faqs.registerFunding.ANSWER1' },
        { question: 'components.register.faqs.registerFunding.QUESTION2', answer: 'components.register.faqs.registerFunding.ANSWER2' },
        { question: 'components.register.faqs.registerFunding.QUESTION3', answer: 'components.register.faqs.registerFunding.ANSWER3' }
      ],
      registerFundingCrypto: [
        { question: 'components.register.faqs.registerFunding.QUESTION1', answer: 'components.register.faqs.registerFunding.ANSWER1' },
        { question: 'components.register.faqs.registerFunding.QUESTION2', answer: 'components.register.faqs.registerFunding.ANSWER2' },
        { question: 'components.register.faqs.registerFunding.QUESTION3', answer: 'components.register.faqs.registerFunding.ANSWER3' }
      ]
    }
  },

  getters: {
    faqs: state => key => state.faqs[key]
  }
}
