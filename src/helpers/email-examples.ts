export const emailExamples = {
    registrationEmail(code: string) {
        return ` <h1>Welcome to PreTurboRich Lobby!</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
              </p>`
    },
    passwordRecovery(code: string) {
        return ` <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`
    }
}