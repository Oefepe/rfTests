import { IStageElements } from '../../../models/IScStageActions';

import { Action, Arrow, Delay, Response } from '../../UI/smartconnector/Index';
import i18n from '../../../config/i18n';

type PropTypes = {
  stageElements: IStageElements[];
};

const stageElementType = (stageEle: IStageElements) => {
  switch (stageEle.nodeType) {
    case 1:
      return <Action name={stageEle.name} actionId={stageEle.id} />;
    case 2:
      return <Response name={stageEle.name} responseId={stageEle.id} />;
    case 3:
      return <Delay stageEle={stageEle} />;
    default:
      return <p>{i18n.t('defaultErrorMessage')}</p>;
  }
};

const RecursiveElement = ({ stageElements }: PropTypes) => {
  return (
    <>
      {stageElements.length > 0 &&
        stageElements.map((stageEle: IStageElements) => (
          <div className='rowC' key={stageEle.id}>
            <>
              <div className='columnC' key={stageEle.id}>
                {stageElementType(stageEle)}
              </div>
              {stageEle.children && (
                <>
                  <div className='columnC'>
                    <RecursiveElement stageElements={stageEle.children} />
                  </div>
                </>
              )}
              {stageEle.parentId !== '' && (
                <Arrow
                  startNode={stageEle.parentId || ''}
                  endNode={stageEle.id}
                />
              )}
            </>
          </div>
        ))}
    </>
  );
};

export default RecursiveElement;
