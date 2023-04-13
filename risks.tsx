import React, { useEffect, useState } from "react";

import { Formik } from "formik";
import * as Yup from "yup";

import { InputTitle } from "./styles";

import { Grid, Container } from "@material-ui/core";

import { labelValidation } from "../../../models";
import Select from "../../../components/Select";
import SelectUser from "../../Admin/User/SelectUser";
import SelectSymptom from "../../Admin/Symptom/SelectSymptom";

import { riskJSON } from "../../../utils/data/checkListJSON";

import Input from "../../../components/Input";

// Actions buttons
import Actions from "./actions";

import Services from "../../../services/RiskPrevention";
import ServicesExecution from "../../../services/Execution";
import Activities from "./activities";
interface IRisks {
  label: string;
  value: number;
}

const Risks = (props: any, Activities: any) => {
  const { submitFunction, item, execution, setExecution, } = props;
  const services = new Services(execution.id);

  const [riskPreventios, setRiskPreventios] = useState<any>();

  const risks: IRisks[] = riskJSON;

  const initial_values: any = riskPreventios
    ? {
      id: riskPreventios.id,
      execution_id: execution.id,
      ensure_security: riskPreventios.ensure_security,
      biggest_risk: riskPreventios.biggest_risk,
      type_risk: riskPreventios.type_risk,
      user_id: riskPreventios.user_id,
      symptom_id: riskPreventios.execution.symptom_id,
    }
    : {
      execution_id: execution.id,
      ensure_security: "",
      biggest_risk: "",
      type_risk: risks[0].value,
      user_id: null,
      symptom_id: null,
    };

  const validation_values = Yup.object().shape({
    ensure_security: Yup.string()
      .trim()
      .required(labelValidation.required)
      .trim(),
    biggest_risk: Yup.string().trim().required(labelValidation.required).trim(),
    type_risk: Yup.number().nullable().required(labelValidation.required),
    user_id: Yup.string()
      .trim()
      .nullable()
      .when("type_risk", {
        is: 2,
        then: Yup.string().trim().required(labelValidation.required).nullable(),
        otherwise: Yup.string().trim().nullable(),
      }),
    symptom_id: Yup.string()
      .trim()
      .nullable()
      .required(labelValidation.required),
  });

  const submition = async (values: any) => {
    const res = riskPreventios
      ? await services.update(values)
      : await services.create(values);
    if (res) submitFunction(values);
  };

  useEffect(() => {
    ServicesExecution.show(execution.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execution.id]);

  useEffect(() => {
    const _onChangeExecution = () => {
      const response = ServicesExecution.getItem();
      if (Boolean(response)) {
        setExecution({ ...response });
      }
    };

    function startValues() {
      ServicesExecution.addChangeListener(_onChangeExecution);
    }

    startValues();

    return function cleanup() {
      ServicesExecution.removeChangeListener(_onChangeExecution);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const _onChange = () => {
      const response = services.getItem();
      if (Boolean(response)) {
        setRiskPreventios(response);
        ServicesExecution.show(execution.id);
      }
    };

    function startValues() {
      services.addChangeListener(_onChange);
      services.show();
    }

    startValues();

    return function cleanup() {
      services.removeChangeListener(_onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [execution.id]);

  return (
    <Formik
      initialValues={initial_values}
      validationSchema={validation_values}
      onSubmit={submition}
      enableReinitialize
    >
      {({
        handleSubmit,
        setFieldValue,
        handleBlur,
        values,
        errors,
        touched,
        isSubmitting
      }) => {
        console.log("propsRisks >>>>", props)
        console.log("act >>>>", {Activities})
        return (
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
              <Grid item style={{ minHeight: '70vh' }}>
                <Grid container direction='column'>
                  <Grid item md={12}>
                    <InputTitle style={{ marginBottom: "1rem" }}>
                      Classificação de Riscos
                    </InputTitle>
                  </Grid>
                  <Grid item>
                    <Grid container>
                      <Grid item>
                        <Input
                          style={{ width: "25rem", marginRight: "1rem" }}
                          value={values.ensure_security}
                          onChange={(event) =>
                            setFieldValue("ensure_security", event.target.value)
                          }
                          error={
                            touched.ensure_security &&
                            Boolean(errors.ensure_security)
                          }
                          helperText={
                            touched.ensure_security
                              ? errors.ensure_security
                              : ""
                          }
                          InputLabelProps={{
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          inputProps={{
                            maxLength: 40,
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          label="O que fazer para garantir a segurança?"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Input
                          value={values.biggest_risk}
                          onChange={(event) =>
                            setFieldValue("biggest_risk", event.target.value)
                          }
                          error={
                            touched.biggest_risk && Boolean(errors.biggest_risk)
                          }
                          helperText={
                            touched.biggest_risk ? errors.biggest_risk : ""
                          }
                          InputLabelProps={{
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          inputProps={{
                            maxLength: 40,
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          label="Qual o maior risco?"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction='row' spacing={2}>
                    <Grid item>
                      <Grid container direction='column'>
                        <Grid item md={12}>
                          <InputTitle style={{ marginBottom: "1rem" }}>
                            Qual a gravidade?
                          </InputTitle>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Select
                            label="Gravidade"
                            style={{ marginBottom: 0, marginRight: 0 }}
                            options={risks}
                            value={values?.type_risk}
                            handleChange={(event) => {
                              const value = event.target.value;
                              if (value === 2) {
                                setFieldValue("user_id", null);
                              }
                              setFieldValue("type_risk", value);
                            }}
                            handleBlur={handleBlur}
                            error={touched.type_risk && Boolean(errors.type_risk)}
                            helperText={touched.type_risk ? errors.type_risk : ""}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    {values?.type_risk === 2 &&
                    <Grid item>
                      <Grid container direction='column'>
                        <Grid item>
                          <InputTitle style={{ marginBottom: "1rem", width: '18rem' }}>
                            Responsável
                          </InputTitle>
                        </Grid>
                        <Grid item>
                          <SelectUser
                            disabled={values.type_risk === 1}
                            value={values?.user_id}
                            label="Responsável"
                            error={touched.user_id && Boolean(errors.user_id)}
                            helperText={touched.user_id ? errors.user_id : ""}
                            onBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            filter="expertTechnicians"
                            />
                        </Grid>
                      </Grid>
                    </Grid>
                    }
                    <Grid item>
                      <Grid container direction='column'>
                        <Grid item>
                          <InputTitle style={{ marginBottom: "1rem" }}>
                            Sintoma
                          </InputTitle>
                        </Grid>
                        <Grid item>
                          <SelectSymptom
                            type_symptom={item.type_symptom}
                            value={values?.symptom_id}
                            placeholder="Atividade Específica"
                            error={
                              touched.symptom_id && Boolean(errors.symptom_id)
                            }
                            helperText={
                              touched.symptom_id ? errors.symptom_id : ""
                            }
                            onBlur={handleBlur}
                            setFieldValue={setFieldValue}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid> {/* final primeiro item*/}
                </Grid>
                <Actions {...{ ...props, isSubmitting }} />
              </Grid>
            </Container>
            {/* <Container maxWidth="lg">
              <Grid
                container
                direction="column"
                justifyContent="space-around"
                style={{ minHeight: "70vh" }}
              >
                <Grid item>
                  <Grid container>
                    <Grid item md={12}>
                      <InputTitle style={{ marginBottom: "1rem" }}>
                        Classificação de Riscos
                      </InputTitle>
                    </Grid>
                    <Grid container>
                      <Grid item>
                        <Input
                          style={{ width: "25rem", marginRight: "1rem" }}
                          value={values.ensure_security}
                          onChange={(event) =>
                            setFieldValue("ensure_security", event.target.value)
                          }
                          error={
                            touched.ensure_security &&
                            Boolean(errors.ensure_security)
                          }
                          helperText={
                            touched.ensure_security
                              ? errors.ensure_security
                              : ""
                          }
                          InputLabelProps={{
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          inputProps={{
                            maxLength: 40,
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          label="O que fazer para garantir a segurança?"
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <Input
                          value={values.biggest_risk}
                          onChange={(event) =>
                            setFieldValue("biggest_risk", event.target.value)
                          }
                          error={
                            touched.biggest_risk && Boolean(errors.biggest_risk)
                          }
                          helperText={
                            touched.biggest_risk ? errors.biggest_risk : ""
                          }
                          InputLabelProps={{
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          inputProps={{
                            maxLength: 40,
                            style: {
                              color: "rgba(40, 75, 99, 0.8)",
                              fontFamily: "LatoRegular, sans-serif",
                            },
                          }}
                          label="Qual o maior risco?"
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Grid item>
                        <InputTitle style={{ marginBottom: "1rem" }}>
                          Qual a gravidade?
                        </InputTitle>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Select
                          label="Gravidade"
                          style={{ marginBottom: 0 }}
                          options={risks}
                          value={values?.type_risk}
                          handleChange={(event) => {
                            const value = event.target.value;
                            if (value === 2) {
                              setFieldValue("user_id", null);
                            }
                            setFieldValue("type_risk", value);
                          }}
                          handleBlur={handleBlur}
                          error={touched.type_risk && Boolean(errors.type_risk)}
                          helperText={touched.type_risk ? errors.type_risk : ""}
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid item>
                        <InputTitle style={{ marginBottom: "1rem" }}>
                          Responsável
                        </InputTitle>
                      </Grid>
                      <Grid item>
                        <SelectUser
                          disabled={values.type_risk === 1}
                          value={values?.user_id}
                          label="Responsável"
                          error={touched.user_id && Boolean(errors.user_id)}
                          helperText={touched.user_id ? errors.user_id : ""}
                          onBlur={handleBlur}
                          setFieldValue={setFieldValue}
                          filter="expertTechnicians"
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid item>
                        <InputTitle style={{ marginBottom: "1rem" }}>
                          Sintoma
                        </InputTitle>
                      </Grid>
                      <Grid item>
                        <SelectSymptom
                          type_symptom={item.type_symptom}
                          value={values?.symptom_id}
                          placeholder="Atividade Específica"
                          error={
                            touched.symptom_id && Boolean(errors.symptom_id)
                          }
                          helperText={
                            touched.symptom_id ? errors.symptom_id : ""
                          }
                          onBlur={handleBlur}
                          setFieldValue={setFieldValue}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Actions {...{ ...props, isSubmitting }} />
              </Grid>
            </Container> */}
          </form>
        );
      }}
    </Formik>
  );
};

export default Risks;
