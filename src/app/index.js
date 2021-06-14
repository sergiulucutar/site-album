import normalizeWheel from 'normalize-wheel'

import Home from './pages/home'
import About from './pages/about'
import Story from './pages/story'

import Canvas from './components/canvas'
import Navigation from './components/navigation'
import { Preloader, PRELOADER_EVENTS } from './components/preloader'

class App {
  constructor () {
    this.preloader = new Preloader()
    this.update()

    this.preloader.once(PRELOADER_EVENTS.completed, () => {
      this.createApp()
      this.onPreloaded()
    })
  }

  createApp () {
    this.createContent()
    this.createPages()
    this.createNavigation()
    this.createCanvas()

    this.addEventListeners()
    this.addLinkListeners()
  }

  createCanvas () {
    this.canvas = new Canvas()
    this.canvas.onChange(this.template)
  }

  createContent () {
    this.content = document.querySelector('#content')
    this.template = this.content.getAttribute('data-template')
  }

  createNavigation () {
    this.navigation = new Navigation({
      template: this.template
    })
  }

  createPages () {
    this.pages = {
      home: new Home(),
      about: new About(),
      story: new Story()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  update () {
    if (this.preloader) {
      this.preloader.update()
    }

    if (this.page) {
      this.page.update()

      if (this.canvas) {
        this.canvas.update()

        if (this.page.scroll) {
          this.canvas.updateScrollOffset(this.page.scroll.getOffset())
        }
      }
    }

    window.requestAnimationFrame(this.update.bind(this))
  }

  addEventListeners () {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('mousewheel', this.onMouseWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this), { passive: false })
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this), { passive: false })
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners () {
    const domLinks = document.querySelectorAll('a')
    for (const domLink of domLinks) {
      domLink.onclick = (event) => {
        event.preventDefault()

        this.onChange(domLink.href)
      }

      let startTimout
      domLink.ontouchstart = (event) => {
        event.preventDefault()
        startTimout = setTimeout(() => {
          startTimout = null
        }, 100)
      }

      domLink.ontouchend = (event) => {
        event.preventDefault()
        if (startTimout) {
          clearTimeout(startTimout)
          this.onChange(domLink.href)
        }
      }
    }
  }

  /**
   * Event handlers
   */

  async onChange (url) {
    if (this.isChangeInProgress) {
      return
    }

    this.isChangeInProgress = true
    await Promise.all([this.canvas.hide(), this.page.hide()])

    const request = await window.fetch(url)

    if (request.status === 200) {
      window.history.pushState({}, '', url)

      const div = document.createElement('div')
      div.innerHTML = await request.text()
      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.canvas.onChange(this.template)
      this.navigation.onChange(this.template)

      this.page = this.pages[this.template]
      this.page.create()

      this.canvas.show()
      this.page.show()

      this.addLinkListeners()
      this.isChangeInProgress = false
    } else {
      console.error('Could not fetch new content')
    }
  }

  async onPreloaded () {
    this.page.onResize()

    await this.preloader.hide()
    this.preloader.destroy()

    this.canvas.show()
    this.page.show()
  }

  onPopState () {
    this.onChange(window.location.pathname)
  }

  onMouseWheel (event) {
    const normalize = normalizeWheel(event)

    this.page.onMouseWheel(normalize)

    if (this.canvas.onMouseWheel) {
      this.canvas.onMouseWheel(normalize)
    }
  }

  onResize () {
    this.page.onResize()

    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize()
    }
  }

  onTouchDown (event) {
    this.page.onTouchDown(event)

    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event)
    }
  }

  onTouchMove (event) {
    this.page.onTouchMove(event)

    if (this.canvas && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event)
    }
  }

  onTouchUp (event) {
    this.page.onTouchUp(event)

    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event)
    }
  }
}

// eslint-disable-next-line no-new
new App()
