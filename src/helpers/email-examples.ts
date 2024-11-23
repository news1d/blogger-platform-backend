export const emailExamples = {
    registrationEmail(code: string) {
        return ` <h1>Welcome to PreTurboRich Lobby!</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
              </p>`
    }
}