import { getRequestConfig } from 'next-intl/server';
import { routing } from '../i18n';

// Each namespace lives in its own file under messages/<locale>/<ns>.json so screens
// can be internationalized independently. They are merged into one messages object
// per locale at request time. Add a new namespace by importing it in both maps below.
import enCommon from '../../messages/en/common.json';
import enLanding from '../../messages/en/landing.json';
import enAuth from '../../messages/en/auth.json';
import enSignup from '../../messages/en/signup.json';
import enDashboard from '../../messages/en/dashboard.json';
import enHousing from '../../messages/en/housing.json';
import enAddHousekeeper from '../../messages/en/addHousekeeper.json';
import enSchedule from '../../messages/en/schedule.json';
import enPlanning from '../../messages/en/planning.json';
import enTasks from '../../messages/en/tasks.json';
import enSettings from '../../messages/en/settings.json';
import enRoot from '../../messages/en.json';

import frCommon from '../../messages/fr/common.json';
import frLanding from '../../messages/fr/landing.json';
import frAuth from '../../messages/fr/auth.json';
import frSignup from '../../messages/fr/signup.json';
import frDashboard from '../../messages/fr/dashboard.json';
import frHousing from '../../messages/fr/housing.json';
import frAddHousekeeper from '../../messages/fr/addHousekeeper.json';
import frSchedule from '../../messages/fr/schedule.json';
import frPlanning from '../../messages/fr/planning.json';
import frTasks from '../../messages/fr/tasks.json';
import frSettings from '../../messages/fr/settings.json';
import frRoot from '../../messages/fr.json';

const MESSAGES: Record<string, Record<string, unknown>> = {
  en: {
    ...enRoot,
    ...enCommon,
    ...enLanding,
    ...enAuth,
    ...enSignup,
    ...enDashboard,
    ...enHousing,
    ...enAddHousekeeper,
    ...enSchedule,
    ...enPlanning,
    ...enTasks,
    ...enSettings,
  },
  fr: {
    ...frRoot,
    ...frCommon,
    ...frLanding,
    ...frAuth,
    ...frSignup,
    ...frDashboard,
    ...frHousing,
    ...frAddHousekeeper,
    ...frSchedule,
    ...frPlanning,
    ...frTasks,
    ...frSettings,
  },
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: MESSAGES[locale],
  };
});
