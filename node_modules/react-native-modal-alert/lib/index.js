/**
 * @flow
 * A custom alert component
 */
import React, { PureComponent } from 'react';
import {
    Animated,
    TouchableWithoutFeedback,
    View,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import ScaleAnimation from './animations/scaleAnimation';

const noop = () => {};

export default class ScaleAlert extends PureComponent {
    static propTypes = {
        animationDuration: PropTypes.number,
        visible: PropTypes.bool.isRequired,
        onShow: PropTypes.func,
        onDismiss: PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        animationDuration: 200,
        visible: false,
        onShow: noop,
        onDismiss: noop,
        onClose: noop
    };

    constructor(props) {
        super(props);

        this.animateHandler = new ScaleAnimation({
            duration: props.animationDuration
        });
    }

    componentDidMount(): void {
        this.props.visible && this.show();
    }

    componentWillReceiveProps(nextProps: Object): void {
        const { visible: prevStatus } = this.props,
            { visible: nextStatus } = nextProps;

        if (prevStatus !== nextStatus) {
            nextStatus ? this.show() : this.hide();
        }
    }

    show(): void {
        const { onShow } = this.props;
        onShow && this.animateHandler.in(onShow);
    }

    hide(): void {
        const { onDismiss } = this.props;
        onDismiss && this.animateHandler.out(onDismiss);
    }

    render() {
        const { onClose, children, visible } = this.props;

        if (!visible) {
            return null;
        }

        return (
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.wrapper}>
                    <Animated.View
                        style={this.animateHandler.animations}
                        onStartShouldSetResponder={() => true}
                    >
                        {children}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
