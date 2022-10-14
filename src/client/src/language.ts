export type LanguageName = "english" | "russia" | "spain"

export interface LanguageListJSON {
    [key: string]: {
        [key: string]: string
    }
}

export class Language {
    private currentLanguage: LanguageName = localStorage.getItem("language") as LanguageName ?? "english"
    private languageList: LanguageName[] = ["english", "russia", "spain"]
    
    constructor(
        private languageListJSON: LanguageListJSON
    ) {}

    get getCurrentLanguage(): LanguageName { return this.currentLanguage }
    get getLanguageList(): LanguageName[] { return this.languageList }

    set setLanguage(languageName: LanguageName) { this.currentLanguage = languageName }

    public getText(name: string): string {
        if (this.languageListJSON[name][this.currentLanguage] == null) {
            return this.languageListJSON[name]["english"]
        } else {
            return this.languageListJSON[name][this.currentLanguage]
        }
    }
}