import Page from '@app/classes/page'

export default class About extends Page {
  constructor () {
    super({
      id: 'about',

      domElement: '.about',
      domChildren: {
        wrapper: '.about__wrapper',
        title: '.about__title'
      }
    })
  }
}
