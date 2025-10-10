import { useEffect, useState } from 'react';
import { ThemeProvider } from 'react-bootstrap';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/App.css';
import { WarningDialog } from './components/warningDialog';
import RouteWrapper from './pages/RouteWrapper';
import { customBreakpoints, STRINGS } from './utils/constants';

function App() {
    const [showWarning, setShowWarning] = useState<boolean>(false);

    /*
     * UseEffect to handle window resize events.
     * Trigger conditions:
     * 	- On component mount but sets a listener on window resize.
     */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200) {
                setShowWarning(true);
            } else if (window.innerWidth >= 1200) {
                setShowWarning(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <ThemeProvider breakpoints={Object.keys(customBreakpoints)}>
            <div className="App">
                {showWarning && (
                    <WarningDialog
                        show={showWarning}
                        onClose={setShowWarning}
                        title="Warning"
                        message={STRINGS.WINDOW_TOO_SMALL}
                        disableHide={true}
                    />
                )}
                <Router basename="/preference-community/">{<RouteWrapper />}</Router>
            </div>
        </ThemeProvider>
    );
}

App.whyDidYouRender = true;
export default App;
