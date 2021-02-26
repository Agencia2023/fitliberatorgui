import React from 'react'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    // static getDerivedStateFromError(error) {
    //     // Update state so the next render will show the fallback UI.    
    //     return { hasError: true };
    // }
    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message        
        this.setState({
            error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }

    render() {
        
        if (this.state.errorInfo) {
            // Error path
            return (
                <div className='ErrorBoundary'>
                    <h3>Something went wrong.</h3>
                    <details style={{ whiteSpace: 'pre-wrap', maxHeight:100, overflowY:'auto' }}>
                        {this.state.hasError && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}