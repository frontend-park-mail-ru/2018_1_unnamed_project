const validators = {
    username: {
        regex: /^([a-zA-Z0-9]{3,})+$/,
        description: 'минимальная длина - 3 символа, разрешены латинские символы и цифры',
    },
    password: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        description: 'минимальная длина - 6, только латинские символы и как минимум 1 цифра',
    },
    passwordConfirmation: {
        regex: /.+/,
        description: 'минимальная длина - 6, только латинские символы и как минимум 1 цифра',
    },
    email: {
        regex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
        description: 'некорректная форма email',
    },
};

/**
 * Валидатор полей формы.
 * @note Допускает только строгое соответствие.
 */
class Validator {
    private readonly _description: string;
    private _lastError: string = null;
    private readonly _regex: RegExp;

    /**
     * @param {RegExp} regex       Регулярное выражение для валидации.
     * @param {string} description Описание ошибки.
     */
    constructor({regex, description}) {
        this._regex = regex;
        this._description = description;
    }

    /**
     * Возвращает последнюю ошибку валидатора.
     * @return {string}
     */
    get lastError(): string {
        return this._lastError;
    }

    /**
     * Проверяет соответствие строки регулярному выражению.
     * @param {string} value Строка для проверки.
     * @return {boolean}
     */
    validate(value: string): boolean {
        if (value.match(this._regex)) {
            this._lastError = null;
            return true;
        } else {
            this._lastError = this._description;
            return false;
        }
    }
}

/**
 * Допускает пустые поля.
 */
class OptionalValidator extends Validator {
    /**
     * @override
     * @param {string} value
     * @return {boolean}
     */
    validate(value: string): boolean {
        if (!value || value === '') {
            return true;
        }
        return super.validate(value);
    }
}

/**
 * Фабрика валидаторов.
 */
export class ValidatorFactory {
    /**
     * @return {Validator}
     */
    static buildUsernameValidator(): Validator {
        return new Validator(validators.username);
    }

    /**
     * @return {OptionalValidator}
     */
    static buildUsernameOptionalValidator(): OptionalValidator {
        return new OptionalValidator(validators.username);
    }

    /**
     * @return {Validator}
     */
    static buildPasswordValidator(): Validator {
        return new Validator(validators.password);
    }

    /**
     * @return {OptionalValidator}
     */
    static buildPasswordOptionalValidator(): OptionalValidator {
        return new OptionalValidator(validators.password);
    }

    /**
     * @return {Validator}
     */
    static buildPasswordConfirmationValidator(): Validator {
        return new Validator(validators.passwordConfirmation);
    }

    /**
     * @return {OptionalValidator}
     */
    static buildPasswordConfirmationOptionalValidator(): OptionalValidator {
        return new OptionalValidator(validators.passwordConfirmation);
    }

    /**
     * @return {Validator}
     */
    static buildEmailValidator(): Validator {
        return new Validator(validators.email);
    }

    /**
     * @return {OptionalValidator}
     */
    static buildEmailOptionalValidator(): OptionalValidator {
        return new OptionalValidator(validators.email);
    }
}
