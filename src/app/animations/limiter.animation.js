import gsap from 'gsap'

import Animation from '@app/classes/animation'

export default class LimiterAnimation extends Animation {
  constructor ({ element }) {
    super({ element })
    this.element = element

    this.animateOut()
  }

  animateIn () {
    gsap.to(this.element, {
      yPercent: 0,
      duration: 1.5,
      ease: 'expo.out'
    })
  }

  animateOut () {
    gsap.set(this.element, {
      yPercent: -100
    })
  }
}
