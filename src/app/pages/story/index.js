import Page from '@app/classes/page'

import LimiterAnimation from '@app/animations/limiter.animation'

export default class Story extends Page {
  constructor () {
    super({
      id: 'story',

      domElement: '.story',
      domChildren: {
        closeButtonLines: '.story__close__lines',
        line: '.story__border__line',
        wrapper: '.story__wrapper'
      }
    })
  }

  create () {
    super.create()

    this.lineAnimation = new LimiterAnimation({ element: this.children.line })
  }

  show () {
    super.show()
    this.children.closeButtonLines.classList.add('story__close__lines--visible')
  }

  hide () {
    this.children.closeButtonLines.classList.remove('story__close__lines--visible')
    super.hide()
  }
}
