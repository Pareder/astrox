import { shallowMount } from '@vue/test-utils'
import Chip from '../Chip'

function getWrapper(props = {}, slots = {}) {
  return shallowMount(Chip, {
    propsData: {
      ...props
    },
    slots: {
      ...slots
    }
  })
}

describe('Chip', () => {
  it('renders an icon', () => {
    const wrapper = getWrapper({ icon: 'some-icon' })

    expect(wrapper.text()).toContain('some-icon')
  })

  it('renders a text prop if it is passed', () => {
    const wrapper = getWrapper({ text: 'some text' })

    expect(wrapper.text()).toContain('some text')
  })

  it('renders default slot if text prop is not passed', () => {
    const wrapper = getWrapper({}, { default: 'slot text' })

    expect(wrapper.text()).toContain('slot text')
  })
})
