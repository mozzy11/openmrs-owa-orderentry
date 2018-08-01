import React from 'react';
import { LabEntryForm, mapStateToProps } from '../../../app/js/components/labOrderEntry/LabEntryForm';
import {
  addDraftLabOrders,
  deleteDraftLabOrder,
} from '../../../app/js/actions/draftLabOrderAction';

import { panelData, testsData } from '../../../app/js/components/labOrderEntry/labData';

let props;
let mountedComponent;

props = {
  draftLabOrders: [
    { id: 1, test: 'Hemoglobin', concept: '12746hfgjff' },
    { id: 2, test: 'Hematocrit', concept: '12746hfgjff' },
    { id: 3, test: 'blood', concept: '12746hfgjff' },
  ],
  defaultTests: [
    { id: 1, test: 'Hemoglobin', concept: '12746hfgjff' },
    { id: 2, test: 'Hematocrit', concept: '12746hfgjff' },
    { id: 3, test: 'blood', concept: '12746hfgjff' },
  ],
  selectedTests: [
    { id: 1, test: 'Hemoglobin', concept: '12746hfgjff' },
    { id: 2, test: 'Hematocrit', concept: '12746hfgjff' },
    { id: 3, test: 'blood', concept: '12746hfgjff' },
  ],
  selectedLabPanels: [panelData[0]],
  dispatch: jest.fn(),
  addDraftLabOrdersToStore: addDraftLabOrders,
  deleteDraftLabOrderFromStore: deleteDraftLabOrder,
  fetchLabOrders: jest.fn(),
  labOrders: {
    results: [
      {
        uuid: '1',
        dateActivated: new Date(),
        concept: {
          display: 'Hemoglobin blood test',
        }
      },
    ],
  },
  createLabOrder: jest.fn(() => {}),
  createLabOrderReducer: {
    status: {
      error: false,
      added: true,
    },
    labOrderData: {},
  },
  session: {
    currentProvider: {
      uuid: 'jfhfhiu77474',
    },
  },
  patient: {
    uuid: 'jfgfhfgf',
  },
  encounterType: {
    uuid: 'fhhfgfh9998',
  },
  inpatientCareSetting: {
    uuid: 'ifffy9847464',
  },
  encounterRole: {
    uuid: '1234trrrrr',
  },
};

const mockTest = testsData[0];

const getComponent = () => {
  if (!mountedComponent) {
    mountedComponent = mount(<LabEntryForm {...props} />);
  }
  return mountedComponent;
};

const mockPanel = {
  id: 1,
  tests: [{ id: 4, test: 'liver' }, { id: 5, test: 'sickling' }, { id: 6, test: 'prothrombin' }],
};

const mockSingleTest = mockTest[0];

describe('Component: LabEntryForm', () => {
  beforeEach(() => {
    mountedComponent = undefined;
  });

  it('should render on initial setup', () => {
    const component = getComponent();
    mapStateToProps({
      draftLabOrderReducer: { draftLabOrders: {} },
      patientReducer: { patient: {} },
      fetchLabOrderReducer: { labOrders: [] },
      openmrs: { session: {} },
      encounterRoleReducer: { encounterRole: {} },
      encounterReducer: { encounterType: {} },
      careSettingReducer: { inpatientCareSetting: {} },
    })
    expect(component).toMatchSnapshot();
  });

  it('should be able to select a category', () => {
    const component = getComponent();
    const categoryButton = component.find('#category-button').at(1); // click on the second category iwth id of 2
    categoryButton.simulate('click', {
      target: {},
    });
    expect(component.state().categoryId).toEqual(2);
  });

  it('should dispatch an action to handle test panel selection', () => {
    const instance = getComponent().instance();
    instance.state.selectedPanelIds = [1];

    const dipatch = jest.spyOn(props, 'dispatch');
    instance.handleTestSelection(mockPanel, 'panel');
    expect(dipatch).toBeCalled();
  });

  it('should dispatch an action to handle single test selection', () => {
    const instance = getComponent().instance();
    instance.state.selectedPanelIds = [1];

    const dipatch = jest.spyOn(props, 'dispatch');
    instance.handleTestSelection(mockTest, 'single');
    expect(dipatch).toBeCalled();
  });

  it(`should change the default lab form's tests category by toggling component state`, () => {
    const component = getComponent();
    const instance = component.instance();
    const defaultCategory = instance.state.categoryId;
    component
      .find('#category-button')
      .at(2)
      .simulate('click', {});
    expect(instance.state.categoryId !== defaultCategory);
  });

  it('shows a toast prompt when test is submitted successfully', () => {
    const component = getComponent();
    const addButton = component.find('.confirm');
    addButton.simulate('click', {});

    component.setProps({
      ...component.props(),
      createLabOrderReducer: {
        status: {
          error: false,
          added: true,
        },
        labOrderData: { uuid: 'kjdhggf', display: 'order Entry', orders: [{ display: 'true' }] },
      },
    });
    expect(global.toastrMessage).toEqual('lab order successfully created');
  });

  it('shows a toast prompt when there is an error in submission', () => {
    const component = getComponent();
    const addButton = component.find('.confirm').at(0);
    addButton.simulate('click', {});
    component.setProps({
      ...component.props(),
      createLabOrderReducer: {
        status: {
          error: true,
          added: false,
        },
        labOrderData: {},
        errorMessage: 'an error occured',
      },
    });
    expect(global.toastrMessage).toEqual('an error occured');
  });

  it(`does not render the past order component if the
  length of the results props is less than 1`, () => {
    const component = getComponent();
    component.setProps({
      ...component.props(),
      labOrders: { results: [] },
    });
    expect(component.find('PastOrders').exists()).toBeFalsy();
  });
});