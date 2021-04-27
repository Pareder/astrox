import { shallowMount } from '@vue/test-utils'
import LaunchChip from '../LaunchChip'

function getWrapper(props = {}) {
  return shallowMount(LaunchChip, {
    propsData: {
      ...props
    }
  })
}

describe('LaunchChip', () => {
  it('renders a count prop', () => {
    const wrapper = getWrapper({ count: 10, status: 'success' })

    expect(wrapper.text()).toContain(10)
  })

  describe('status prop', () => {
    const statuses = [
      {
        status: 'success',
        result: 'successful'
      },
      {
        status: 'fail',
        result: 'failed'
      },
      {
        status: 'pending',
        result: 'pending'
      },
      {
        status: 'commercial',
        result: 'commercial'
      },
      {
        status: 'government',
        result: 'government'
      }
    ]

    for (const { status, result } of statuses) {
      it(`renders correct text in case if status prop is equal to: ${status}`, () => {
        const wrapper = getWrapper({ count: 10, status })

        expect(wrapper.text()).toContain(`${result} launches`)
      })

      it(`renders correct text in case if count is equal to 1 and status prop is equal to: ${status}`, () => {
        const wrapper = getWrapper({ count: 1, status })

        expect(wrapper.text()).toContain(`${result} launch`)
      })
    }
  })
})
