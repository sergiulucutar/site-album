import { Mesh, Program, Texture } from 'ogl'

import vertexShader from '@app/shaders/media/vertex.glsl'
import fragmentShader from '@app/shaders/media/fragment.glsl'

export default class Media {
  constructor ({ element, geometry, gl, parent, viewport, image }) {
    this.gl = gl
    this.parent = parent
    this.viewport = viewport

    this.element = element
    this.geometry = geometry

    this.texture = new Texture(this.gl, {
      generateMipmaps: false,
      image: image
    })

    this.createBounds()
    this.createProgram()
    this.createMesh()

    this.onResize(this.viewport)
  }

  createProgram () {
    const canvasAspect = this.bounds.width / this.bounds.height
    const imageAspect = this.texture.image.width / this.texture.image.height

    let scaleY = 1
    let scaleX = imageAspect / canvasAspect
    if (scaleX < 1) {
      scaleY = 1 / scaleX
      scaleX = 1
    }

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uOffset: {
          value: 0
        },
        uTexture: {
          value: this.texture
        },
        uTextureScale: {
          value: [scaleX, scaleY]
        }
      }
    })
  }

  createMesh () {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.parent)
  }

  createBounds () {
    this.bounds = this.element.getBoundingClientRect()
  }

  updateScale () {
    this.mesh.scale.x = this.viewport.width * (this.bounds.width / window.innerWidth)
    this.mesh.scale.y = this.viewport.height * (this.bounds.height / window.innerHeight)
  }

  updatePosition () {
    this.mesh.position.x = (-this.viewport.width / 2) + (this.mesh.scale.x / 2) + (this.bounds.left / window.innerWidth) * this.viewport.width
    this.mesh.position.y = (this.viewport.height / 2) - (this.mesh.scale.y / 2) - (this.bounds.top / window.innerHeight) * this.viewport.height
  }

  updateRotation () {
    this.mesh.rotation.z = 0.1
  }

  onResize (viewport) {
    this.viewport = viewport

    this.createBounds()
    this.updateScale()
    this.updatePosition()
    this.updateRotation()
  }
}
