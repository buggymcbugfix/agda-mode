import * as React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import * as classNames from 'classnames';

import { View } from '../../type';
import * as Action from '../actions';
import Core from '../../core';

// Atom shits
type CompositeDisposable = any;
var { CompositeDisposable } = require('atom');
declare var atom: any;

type OwnProps = React.HTMLProps<HTMLElement> & {
    core: Core;
}
type InjProps = {
    mountAt: {
        previous: View.MountingPosition,
        current: View.MountingPosition
    };
    settingsView: boolean;
}
type DispatchProps = {
    handleMountAtPane: () => void
    handleMountAtBottom: () => void;
    handleToggleSettingsView: () => void;
}
type Props = OwnProps & InjProps & DispatchProps;

function mapStateToProps(state: View.State): InjProps {
    return {
        mountAt: state.view.mountAt,
        settingsView: state.view.settingsView
    }
}

function mapDispatchToProps(dispatch): DispatchProps {
    return {
        handleMountAtPane: () => {
            dispatch(Action.VIEW.mountAtPane());
        },
        handleMountAtBottom: () => {
            dispatch(Action.VIEW.mountAtBottom());
        },
        handleToggleSettingsView: () => {
            dispatch(Action.VIEW.toggleSettings());
        }
    };
}

class Dashboard extends React.Component<Props, void> {
    private subscriptions: CompositeDisposable;
    private toggleMountingPositionButton: HTMLElement;
    private toggleSettingsViewButton: HTMLElement;

    constructor() {
        super();
        this.subscriptions = new CompositeDisposable;
    }

    componentDidMount() {
        this.subscriptions.add(atom.tooltips.add(this.toggleSettingsViewButton, {
            title: 'settings',
            delay: 100
        }));
        this.subscriptions.add(atom.tooltips.add(this.toggleMountingPositionButton, {
            title: 'toggle panel docking position',
            delay: 300,
            keyBindingCommand: 'agda-mode:toggle-docking'

        }));
    }

    componentWillUnmount() {
        this.subscriptions.dispose();
    }

    render() {
        const { mountAt, settingsView } = this.props;
        const { core } = this.props;
        const { handleMountAtPane, handleMountAtBottom, handleToggleSettingsView } = this.props;
        const settingsViewClassList = classNames({
            activated: settingsView,
        }, 'no-btn');
        const toggleMountingPosition = classNames({
            activated: mountAt.current === View.MountingPosition.Pane
        }, 'no-btn');
        return (
            <ul className="agda-dashboard">
                <li>
                    <button
                        className={settingsViewClassList}
                        onClick={() => {
                            handleToggleSettingsView()
                            if (settingsView)
                                core.view.settingsViewPaneItem.close();
                            else
                                core.view.settingsViewPaneItem.open();
                        }}
                        ref={(ref) => {
                            this.toggleSettingsViewButton = ref;
                        }}
                    >
                        <span className="icon icon-settings"></span>
                    </button>
                </li>
                <li>
                    <button
                        className={toggleMountingPosition}
                        onClick={() => {
                            core.view.toggleDocking();
                        }}
                        ref={(ref) => {
                            this.toggleMountingPositionButton = ref;
                        }}
                    >
                        <span className="icon icon-versions"></span>
                    </button>
                </li>
            </ul>
        )
    }
}

export default connect<InjProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);