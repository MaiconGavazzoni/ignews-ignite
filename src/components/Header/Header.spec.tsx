import { render, screen } from '@testing-library/react'
import { Header } from '.'
import client, { Session } from "next-auth/core/types";


jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

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

describe('Header component', () => {

  it('renders correctly', () => {
    render(
      <Header />

    )

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Posts')).toBeInTheDocument();
  })



})

