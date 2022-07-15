import { render, screen } from '@testing-library/react'
import { SignInButton } from '.';
import { Session } from "next-auth/core/types";



jest.mock('next-auth/react', () => {
  return {
    useSession() {
      const mockSession: Session = {
        expires: "1",
        user: { email: "a", name: "Delta", image: "c" },
      };
      return mockSession
    }
  }
})

describe('SignInButton component', () => {

  it('render correctly when user is not authenticated', () => {

    render(
      <SignInButton />

    )

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  })

  it('render correctly when user is authenticated', () => {
    render(
      <SignInButton />

    )

    expect(screen.getByText('Delta')).toBeInTheDocument();

  })



})