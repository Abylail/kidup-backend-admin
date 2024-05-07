import {DataTypes} from "sequelize";

const getToySurveyModel = sequelize => {
    const ToySurvey = sequelize.define('toySurvey', {
        answer: {
            type: DataTypes.JSON,
        }
    })

    return ToySurvey
}

export default getToySurveyModel