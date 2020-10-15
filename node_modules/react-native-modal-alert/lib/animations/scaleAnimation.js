import Animation from './baseAnimation';

const noop = () => {};

export default class ScaleAnimation extends Animation {
    in(onFinished?: Function = noop): void {
        this.Animated.spring(this.animate, {
            toValue: 1,
            velocity: 0,
            tension: 65,
            friction: 7,
            useNativeDriver: this.useNativeDriver
        }).start(onFinished);
    }

    out(onFinished?: Function = noop): void {
        this.Animated.timing(this.animate, {
            toValue: 0,
            duration: this.duration,
            useNativeDriver: this.useNativeDriver
        }).start(onFinished);
    }

    get animations(): Object {
        return {
            transform: [
                {
                    scale: this.animate.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ]
        };
    }
}
