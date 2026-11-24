import { GithubLogo } from "@/components/logos/github";
import { GoogleLogo } from "@/components/logos/google";

const buttonClass =
  "inline-flex h-10 items-center justify-center gap-2.5 rounded-lg border border-border bg-card px-4 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function SignInButtons() {
  return (
    <section
      id="sign-in"
      aria-labelledby="sign-in-title"
      className="border-y border-border/60 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2 id="sign-in-title" className="text-2xl font-semibold tracking-tight text-balance">
          Sign in with
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The text names the action, so each mark is decorative.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={buttonClass}>
            <GithubLogo title="" className="h-5 w-auto" />
            <span>Sign in with GitHub</span>
          </button>
          <button type="button" className={buttonClass}>
            <GoogleLogo title="" className="h-5 w-auto" />
            <span>Sign in with Google</span>
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Demo only. These buttons are not wired to an auth provider.
        </p>
      </div>
    </section>
  );
}
