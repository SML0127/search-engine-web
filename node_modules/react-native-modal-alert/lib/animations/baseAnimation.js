import { Animated } from 'react-native';

export type AnimationConfig = {
    initialValue?: number;
    useNativeDriver?: boolean;
    duration?: number;
};

export default class Animation {
    Animated = Animated;
    useNativeDriver: boolean;
    animate: Animated.Value;
    duration: number;

    constructor({
        initialValue = 0,
        useNativeDriver = true,
        duration = 200
    }: AnimationConfig = {}) {
        this.animate = new Animated.Value(initialValue);
        this.useNativeDriver = useNativeDriver;
        this.duration = duration;
    }

    in(onFinished?: Function): void {
        throw Error('not implemented yet');
    }

    out(onFinished?: Function): void {
        throw Error('not implemented yet');
    }

    get animations(): Object {
        throw Error('not implemented yet');
    }
}
