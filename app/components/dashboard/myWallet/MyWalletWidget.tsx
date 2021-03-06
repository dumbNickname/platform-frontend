import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import {
  selectTotalEtherBalance,
  selectTotalEtherBalanceEuroAmount,
  selectTotalEuroBalance,
  selectTotalEuroTokenBalance,
} from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button } from "../../shared/Buttons";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { Money } from "../../shared/Money";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";

import { CommonHtmlProps } from "../../../types";
import { appRoutes } from "../../appRoutes";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./MyWalletWidget.module.scss";

type StateProps = {
  isLoading: boolean;
  error?: string;
  data?: {
    euroTokenAmount: string;
    ethAmount: string;
    ethEuroAmount: string;
    totalAmount: string;
  };
};

export const MyWalletWidgetComponentBody: React.SFC<StateProps> = props => {
  if (props.isLoading) {
    return <LoadingIndicator />;
  } else if (props.error) {
    return <WarningAlert>{props.error}</WarningAlert>;
  } else {
    const { euroTokenAmount, ethAmount, ethEuroAmount, totalAmount } = props.data!;

    return (
      <>
        <Row>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency="eur_token"
              largeNumber={euroTokenAmount}
              icon={moneyIcon}
              value={euroTokenAmount}
              currencyTotal="eur"
              data-test-id="my-wallet-widget-eur-token"
            />
          </Col>
          <Col className={styles.moneySuiteWrapper} xs={12} sm={6} lg={12}>
            <MoneySuiteWidget
              currency="eth"
              largeNumber={ethAmount}
              icon={ethIcon}
              className={cn(styles.borderLeft, "pl-sm-2 pl-md-0")}
              value={ethEuroAmount}
              currencyTotal="eur"
              data-test-id="my-wallet-widget-eth-token"
            />
          </Col>
        </Row>
        <Row data-test-id="my-wallet-widget-total">
          <Col>
            <div className={`${styles.total} mt-3 mb-3 d-flex align-items-center`}>
              <span className={cn(styles.smallFont)}>
                <FormattedMessage id="dashboard.my-wallet-widget.total" />
              </span>
              <Money
                value={totalAmount}
                currency="eur"
                noCurrencySymbol
                className={cn(styles.money, "pl-1 pl-sm-2 m-0")}
              />
              <span className="pl-1">EUR</span>
            </div>
          </Col>
          <Col className="d-block d-sm-none text-right col-auto">
            <Link to={appRoutes.wallet}>
              <Button
                layout="secondary"
                iconPosition="icon-after"
                theme="dark"
                svgIcon={arrowRight}
                className={cn(styles.link, "pr-0")}
              >
                <FormattedMessage id="dashboard.my-wallet-widget.hidden-wallet-redirect-button" />
              </Button>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
};

export const MyWalletWidgetComponent: React.SFC<CommonHtmlProps & StateProps> = ({
  className,
  style,
  ...props
}) => {
  return (
    <Panel
      headerText={
        <FormattedMessage id="components.dashboard.my-wallet.my-wallet-widget.header-text" />
      }
      rightComponent={
        <Link to={appRoutes.wallet}>
          <Button
            layout="secondary"
            iconPosition="icon-after"
            theme="dark"
            svgIcon={arrowRight}
            className={cn(styles.link, "pr-0")}
          >
            <FormattedMessage id="dashboard.my-wallet-widget.main-wallet-redirect-button" />
          </Button>
        </Link>
      }
      className={className}
      style={style}
    >
      <MyWalletWidgetComponentBody {...props} />
    </Panel>
  );
};

export const MyWalletWidget = compose<React.SFC<CommonHtmlProps>>(
  onEnterAction({ actionCreator: d => d(actions.wallet.startLoadingWalletData()) }),
  appConnect<StateProps>({
    stateToProps: s => {
      const isLoading = s.wallet.loading;
      const error = s.wallet.error;

      if (!isLoading && !error) {
        const walletData = s.wallet.data!;
        return {
          isLoading,
          error,
          data: {
            euroTokenAmount: selectTotalEuroTokenBalance(walletData),
            ethAmount: selectTotalEtherBalance(walletData),
            ethEuroAmount: selectTotalEtherBalanceEuroAmount(walletData),
            totalAmount: selectTotalEuroBalance(walletData),
          },
        };
      } else {
        return {
          isLoading,
          error,
        };
      }
    },
  }),
)(MyWalletWidgetComponent);
