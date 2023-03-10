import { mdiCheckOutline, mdiTennis } from '@mdi/js'
import React, {  } from 'react'
import BaseButton from '../components/BaseButton'
import CardBox from '../components/CardBox'
import IconRounded from '../components/IconRounded'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { useMatches } from '../hooks/matches'


const CardBoxSquad = () => {
  const icon = mdiCheckOutline;
  const [yourMatches, isLoadingMatches] = useMatches(true)

  return (
    <CardBox className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center justify-start mb-6 md:mb-0">
          <IconRounded icon={icon} color='danger' className="md:mr-6 mb-6 md:mb-0" />
          {isLoadingMatches && <LoadingIndicator /> }
          {!isLoadingMatches && 
            <div className="text-center space-y-1 md:text-left md:mr-6">
              <h4 className="text-xl">{yourMatches.length === 1 ? `1 Match` : `${yourMatches.length} Matches`}</h4>
              <p className="text-gray-500 dark:text-slate-400">
                <b>Score: 4.5</b><br/>
                <small>Your score accross all macthes</small>
              </p>            
            </div>
          }
        </div>
        <div className="text-center md:text-right space-y-2">
          <BaseButton
            href="/squads/create"
            label="Create a new match"
            icon={mdiTennis}
            color="danger"
            roundedFull
            small
            disabled={isLoadingMatches}
          />
        </div>
      </div>
    </CardBox>
  )
}

export default CardBoxSquad
