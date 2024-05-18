import * as Sentry from '@sentry/react-native';

const overrideConsoleMethods = () => {
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;
    const originalConsoleDebug = console.debug;

    console.error = (...args) => {
        originalConsoleError(...args);
        Sentry.captureMessage(`Error: ${args.join(' ')}`, 'error');
    };

    console.log = (...args) => {
        originalConsoleLog(...args);
        Sentry.captureMessage(`Log: ${args.join(' ')}`, 'info');
    };

    console.warn = (...args) => {
        originalConsoleWarn(...args);
        Sentry.captureMessage(`Warning: ${args.join(' ')}`, 'warning');
    };

    console.info = (...args) => {
        originalConsoleInfo(...args);
        Sentry.captureMessage(`Info: ${args.join(' ')}`, 'info');
    };

    console.debug = (...args) => {
        originalConsoleDebug(...args);
        Sentry.captureMessage(`Debug: ${args.join(' ')}`, 'debug');
    };
};

export default overrideConsoleMethods;
