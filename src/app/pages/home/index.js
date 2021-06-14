import gsap from 'gsap'

import Page from '@app/classes/page'

export default class Home extends Page {
  constructor () {
    super({
      id: 'home',

      domElement: '.home',
      domChildren: {
        items: '.home__gallery__link',
        indicator: '.home__gallery__indicator__wrapper'
      }
    })
  }

  hide () {
    super.hide()

    gsap.to(this.children.indicator, {
      scale: 0.1,
      duration: 1,
      ease: 'expo.out'
    })
  }

  show () {
    super.show()

    gsap.from(this.children.indicator, {
      scale: 2,
      duration: 1,
      ease: 'expo.out'
    })
  }

  onTouchDown (event) {
    event.preventDefault()

    super.onTouchDown(event)
  }
}
