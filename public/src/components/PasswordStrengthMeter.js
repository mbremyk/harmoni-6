import React, {Component} from 'react';
import zxcvbn from 'zxcvbn';

class PasswordStrengthMeter extends Component {

    createPasswordLabel = (result) => {
        switch (result.score) {
            case 0:
                return 'BYTT PASSORD!';
            case 1:
                return 'Svak';
            case 2:
                return 'Middels';
            case 3:
                return 'God';
            case 4:
                return 'Sterk';
            default:
                return 'Svak';
        }
    };

    render() {
        const {password} = this.props;
        const testedResult = zxcvbn(password);
        return (
            <div className="password-strength-meter">
                <progress
                    className={`password-strength-meter-progress strength-${this.createPasswordLabel(testedResult)}`}
                    value={testedResult.score}
                    max="4"
                />
                <br/>
                <label
                    className="password-strength-meter-label"
                >
                    {password && (
                        <>
                            <strong>Passordstyrke:</strong> {this.createPasswordLabel(testedResult)}
                        </>
                    )}
                </label>
            </div>
        );
    }
}

export default PasswordStrengthMeter;