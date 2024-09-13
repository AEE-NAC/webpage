const Signup = () => {
  return (
    <div className="min-h-full w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-2 bg-white">
        <div className="fixed top-0 left-0 p-4">
          <img src="/images/favicon.png" alt="DJONDJON Logo" className="w-12 h-12" />
        </div>
        <div className="max-w-md w-full">
          <h1 className="text-4xl font-bold mb-6 text-center">Create an Account</h1>
          <form method="POST" action="/api/auth">
            <div className="flex flex-row w-full justify-between">
              <div className="space-y-2 inC">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="nom">
                  Nom
                </label>
                <input name="nom" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="nom" placeholder="Kyllian" type="text" required />
              </div>
              <div className="space-y-2 inC">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="prenom">
                  Prenom
                </label>
                <input name="prenom" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="prenom" placeholder="jonh" type="text" required />
              </div>
            </div>
            <div className="flex flex-row w-full justify-between">
              <div className="space-y-2 inC">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="username">
                  Username
                </label>
                <input name="username" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="username" placeholder="Doe" type="text" required />
              </div>
              <div className="space-y-2 roles">
                <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </label>
                <select id="status" name="roles" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                  <option selected>Status</option>
                  <option value="0">Volontaire</option>
                  <option value="1">Membre de conseil</option>
                  <option value="2">Moniteur</option>
                  <option value="3">Supporteur</option>
                  <option value="5">Formateur</option>
                  <option value="6">Ouvrier a temps plein</option>
                  <option value="7">Ouvrier a temps partiel</option>
                  <option value="4">autres</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 inC">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="pjk">
                Telephone
              </label>
              <input type="tel" name="telephone" id="pjk" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required />
            </div>
            <div className="space-y-2 inC">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email
              </label>
              <input name="email" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="email" placeholder="m@example.com" type="email" required />
            </div>
            <div className="flex flex-row w-full justify-between">
              <div className="space-y-2 inC country">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select id="country" name="country" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"></select>
              </div>
              <div className="space-y-2 inC state">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select name="state" id="state" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option selected>Select state</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 inC">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <input name="password" className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" id="password" type="password" required />
            </div>
            <input type="hidden" id="hiddenInput1" name="telephone" value="" />
            <input type="hidden" id="hiddenInput" name="action" value="" />
            <div className="space-y-2">
              <div className="space-y-2">
                <p id="message"></p>
              </div>
              <div className="space-y-2" id="signin">
                <span className="text-sm text-gray-500 dark:text-blue-400" onClick={() => setHiddenValue('signin')}>
                  I have already an account
                </span>
              </div>
              <div className="space-y-2" style={{ display: 'none' }} id="signup">
                <span className="text-sm text-gray-500 dark:text-blue-400" onClick={() => setHiddenValue('signup')}>
                  I don't have an account
                </span>
              </div>
              <div className="space-y-2" style={{ display: 'none' }} id="forgot">
                <span className="text-sm text-gray-500 dark:text-blue-400" onClick={() => setHiddenValue('forgot')}>
                  I forgot my password
                </span>
              </div>
              <button type="button" onClick={() => send()} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full inC">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div
        className="hidden md:block h-screen md:w-1/2 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/signup.jpg)' }}
      ></div>
    </div>
  );
};

export default Signup;
