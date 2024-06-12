import "dotenv/config";

import getUserRoutes from "./user.js";
import getUsersRoutes from "./users.js";
import getRolesRoutes from "./role.js";
import getCategoryRoutes from "./category.js";
import getSubjectRoutes from "./subject.js";
import getParentRoutes from "./parent.js";
import getInstitutionRoutes from "./institution.js";
import getTrialRegistrationsRoutes from "./trialRegistrations.js";
import getRequestsRoutes from "./requests.js";
import getToyRoutes from "./toys/toy.js";
import getCategoryToyRoutes from "./toys/toyCategory.js";
import getToySubscribeRequestRoutes from "./toys/toysSubscribeRequest.js";
import getToySubscriberRoutes from "./toys/toySubscriber.js";
import getToyPacksRoutes from "./toys/toyPacks.js";
import getAnnouncementRoutes from "./announcement.js";

export default app => {
    const BaseUrl = "/api/v1/admin";

    app.use(`${BaseUrl}/user`, getUserRoutes(app))
    app.use(`${BaseUrl}/users`, getUsersRoutes(app))
    app.use(`${BaseUrl}/role`, getRolesRoutes(app))
    app.use(`${BaseUrl}/category`, getCategoryRoutes(app))
    app.use(`${BaseUrl}/subject`, getSubjectRoutes(app))
    app.use(`${BaseUrl}/parent`, getParentRoutes(app))
    app.use(`${BaseUrl}/institution`, getInstitutionRoutes(app))
    app.use(`${BaseUrl}/trialregistrations`, getTrialRegistrationsRoutes(app))
    app.use(`${BaseUrl}/requests`, getRequestsRoutes(app))
    app.use(`${BaseUrl}/toy`, getToyRoutes(app))
    app.use(`${BaseUrl}/toyCategory`, getCategoryToyRoutes(app))
    app.use(`${BaseUrl}/toySubscribeRequest`, getToySubscribeRequestRoutes(app))
    app.use(`${BaseUrl}/toySubscriber`, getToySubscriberRoutes(app))
    app.use(`${BaseUrl}/toyPacks`, getToyPacksRoutes(app))
    app.use(`${BaseUrl}/announcement`, getAnnouncementRoutes(app))
}