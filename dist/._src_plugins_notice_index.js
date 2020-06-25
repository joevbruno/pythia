import Notice from '@/plugins/notice/Notice'

function NoticePlugin(i18n) {
  return {
    install(Vue) {
      const CONSTRUCTOR = Vue.extend(Notice)
      const CACHE = {}

      function notice(msg, action = () => ({}), options = {}) {
        options.id = options.id || (new Date()).getTime()
        const notice = CACHE[options.id] || (CACHE[options.id] = new CONSTRUCTOR())
        options.action = action
        let noticeMessage = null

        if (typeof msg === 'object' && msg !== null) {
          if (msg.i18nKey) {
            noticeMessage = i18n.t(msg.i18nKey)
          }
        } else {
          noticeMessage = i18n.t(msg)
        }

        options.message = noticeMessage

        if (!notice.$el) {
          const vm = notice.$mount()
          document.querySelector(options.parent || 'body').append(vm.$el)
        }

        if (noticeMessage) {
          notice.queued.push(options)
        } else {
          console.error(msg)
        }
      }

      Vue.prototype.$notice = notice
      Vue.notice = notice
    }
  }
}

export default NoticePlugin
