import { mdiGithub } from '@mdi/js'
import BaseButton from '../components/BaseButton'
import SectionBanner from '../components/SectionBanner'

const SectionBannerProfile = () => {
  return (
    <SectionBanner className="bg-gradient-to-tr from-cyan-400 via-violet-400 to-purple-500">
      <h1 className="text-3xl text-white mb-6">
        Like the project? Please star on <b>GitHub</b> ;-)
      </h1>
      <div>
        <BaseButton
          href="https://github.com/justboil/admin-one-react-tailwind"
          icon={mdiGithub}
          label="GitHub"
          target="_blank"
          roundedFull
        />
      </div>
    </SectionBanner>
  )
}

export default SectionBannerProfile
