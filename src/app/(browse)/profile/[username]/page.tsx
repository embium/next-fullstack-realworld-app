import getUserProfile from '@/actions/getUserProfile'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import QueryLink from '@/components/common/QueryLink'
import ProfileTab from '@/components/profile/ProfileTab'
import getCurrentUser from '@/actions/getCurrentUser'
import Link from 'next/link'
import FollowButton from '@/components/common/FollowButton'
import clsx from 'clsx'
import { Profile } from '@/types/response'
import { FollowProvider } from '@/components/common/FollowProvider'

interface ProfilePageProps {
  params: { username: string }
  searchParams: {
    tab?: 'my' | 'favorited'
    page?: string
  }
}

async function getProfile(originUsername: string) {
  const username = decodeURIComponent(originUsername).replace(/@/, '')
  const profile = await getUserProfile(username)
  return profile
}

const ProfilePage = async ({ params, searchParams }: ProfilePageProps) => {
  const profile = (await getProfile(params.username)) as Profile
  if (!profile) {
    redirect('/')
  }

  const tab = searchParams.tab || 'my'
  const page = Number(searchParams.page) || 1
  const currentUser = await getCurrentUser()

  return (
    <FollowProvider following={profile.following}>
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <Image
                  src={profile.image as string}
                  alt={profile.username}
                  width={100}
                  height={100}
                  className="user-img"
                />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>
                {currentUser?.username === profile.username ? (
                  <Link
                    href={'/settings'}
                    className="btn btn-sm btn-outline-secondary action-btn"
                  >
                    <i className="ion-gear-a"></i>
                    &nbsp;Edit Profile Settings
                  </Link>
                ) : (
                  currentUser && (
                    <FollowButton
                      author={profile.username}
                      className={'mr-1'}
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <QueryLink
                      query={{ tab: 'my' }}
                      className={clsx(
                        'nav-link',
                        tab !== 'favorited' && 'active',
                      )}
                    >
                      My Articles
                    </QueryLink>
                  </li>
                  <li className="nav-item">
                    <QueryLink
                      query={{ tab: 'favorited' }}
                      className={clsx(
                        'nav-link',
                        tab === 'favorited' && 'active',
                      )}
                    >
                      Favorited Articles
                    </QueryLink>
                  </li>
                </ul>
              </div>
              <ProfileTab tab={tab} username={profile.username} page={page} />
            </div>
          </div>
        </div>
      </div>
    </FollowProvider>
  )
}
export default ProfilePage
