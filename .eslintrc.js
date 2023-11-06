module.exports = {
    root: true,
    extends: '@react-native',
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "__DEV__": "readonly"
    },
    rules: {
        "prettier/prettier": "off",
        "react/display-name": "off",
        "no-console": [
            "error",
            {
                "allow": [
                    "tron",
                    "info",
                    "warn", 
                    "error"
                ]
            }
        ],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
        "quotes": ["error", "single", {
            "allowTemplateLiterals": true
        }],
        "import/default": "off",
        "import/prefer-default-export": "off",
        "class-methods-use-this": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "import/namespace": "off",     
        "import/no-unresolved": "off",
        "import/no-named-as-default": "off",
        "import/no-named-as-default-member": "off",
        "comma-dangle": "off",
        // TypeScript
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { "args": "none" }],
        "@typescript-eslint/no-empty-interface": "off",
        
        // React
        "react/jsx-props-no-spreading": "off",
        "react/jsx-filename-extension": [
            "warn",
            {
                "extensions": [
                    ".js",
                    ".jsx",
                    ".ts",
                    ".tsx"
                ]
            }
        ],
        "react/prop-types": "off",
        // React Hooks
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error"
    },
};
