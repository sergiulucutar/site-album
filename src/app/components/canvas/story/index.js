import gsap from 'gsap'
import { Plane, Transform } from 'ogl'

import State from '@app/state'
import Media from './media'

export default class Story {
  constructor ({ gl, scene, viewport }) {
    this.gl = gl
    this.scene = scene
    this.viewport = viewport

    this.group = new Transform()
    this.group.setParent(scene)

    this.scrollGroup = new Transform()
    this.scrollGroup.setParent(this.group)

    this.mediaElement = document.querySelector('.story__photo__media__image')

    this.geometry = new Plane(this.gl)
    this.media = new Media({
      gl: this.gl,
      parent: this.scrollGroup,
      viewport: this.viewport,
      geometry: this.geometry,
      element: this.mediaElement,
      image: State.data.images[this.mediaElement.getAttribute('src')]
    })

    this.active = true
  }

  updateScrollOffset (scroll) {
    const y = scroll.current / window.innerHeight
    this.group.position.y = -y * this.viewport.height
  }

  hide () {
    return new Promise(resolve => gsap.to(this.scrollGroup.position, {
      y: -this.viewport.height,
      duration: 1,
      ease: 'expo.in',
      onComplete: resolve
    }))
  }

  show () {
    this.scrollGroup.position.y = this.viewport.height
    gsap.to(this.scrollGroup.position, {
      y: 0,
      duration: 1,
      ease: 'expo.out'
    })
  }

  /**
   * Events
   */

  onResize (viewport) {
    this.viewport = viewport

    this.media.onResize(viewport)
  }

  /**
   * Destroy
   */

  destroy () {
    this.scene.removeChild(this.group)
  }
}
