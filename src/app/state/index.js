export class State {
  constructor () {
    this.data = {
      images: null
    }
  }

  addImages (images) {
    this.data.images = images
  }
}

export default new State()
