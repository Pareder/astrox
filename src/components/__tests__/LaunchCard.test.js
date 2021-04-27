import { mount, shallowMount } from '@vue/test-utils'
import LaunchCard from '../LaunchCard'
import { localVue, store } from '../../store/__mocks__/storeMock'

function getWrapper(props = {}, isMount = false) {
  const mountFn = isMount ? mount : shallowMount
  return mountFn(LaunchCard, {
    propsData: {
      ...props
    },
    localVue,
    store
  })
}

describe('LaunchCard', () => {
  const launch = {
    name: 'some name',
    launch_service_provider: {},
    status: {}
  }

  it('renders correct header', () => {
    const wrapper = getWrapper({ launch })
    const header = wrapper.find('.headline')

    expect(header.exists()).toBe(true)
    expect(header.text()).toBe(launch.name)
  })

  it('emits event on button click', async () => {
    const wrapper = getWrapper({ launch }, true)
    const button = wrapper.findComponent({ name: 'v-btn' })

    await button.trigger('click')

    expect(wrapper.emitted().click).toBeTruthy()
  })
})
