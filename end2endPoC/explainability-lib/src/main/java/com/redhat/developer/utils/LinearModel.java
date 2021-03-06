package com.redhat.developer.utils;

import java.util.Arrays;
import java.util.Collection;
import java.util.stream.IntStream;

import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LinearModel {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private final double[] weights;
    private final boolean classification;
    private double bias;

    public LinearModel(int size, boolean classification) {
        this.bias = 0;
        this.weights = new double[size];
        this.classification = classification;
    }

    public double fit(Collection<Pair<double[], Double>> trainingSet) {
        double[] sampleWeights = new double[trainingSet.size()];
        Arrays.fill(sampleWeights, 1);
        return fit(trainingSet, sampleWeights);
    }

    public double fit(Collection<Pair<double[], Double>> trainingSet, double[] sampleWeights) {
        double floss = 1d;
        if (trainingSet.isEmpty()) {
            logger.warn("fitting an empty training set");
        } else {
            double lr = 0.01;
            int e = 0;
            while (floss > 0.1 && e < 15) {
                double loss = 0;
                int i = 0;
                for (Pair<double[], Double> sample : trainingSet) {
                    double[] doubles = sample.getLeft();
                    double predictedOutput = predict(doubles);
                    double targetOutput = sample.getRight();
                    double diff = checkFinite(targetOutput - predictedOutput);
                    if (diff != 0) { // avoid null updates to save computation
                        loss += Math.abs(diff) / trainingSet.size();
                        for (int j = 0; j < weights.length; j++) {
                            double v = lr * diff * doubles[j];
                            if (trainingSet.size() == sampleWeights.length) {
                                v *= sampleWeights[i];
                            }
                            v = checkFinite(v);
                            weights[j] += v;
                            bias += lr * diff * sampleWeights[i];
                        }
                    }
                    i++;
                }
                lr *= (1d / (1d + 0.01 * e)); // learning rate decay

                floss = loss;
                e++;
                logger.debug("epoch {}, loss: {}", e, loss);
            }
        }
        return floss;
    }

    private double checkFinite(double diff) {
        if (Double.isNaN(diff) || Double.isInfinite(diff)) {
            diff = 0;
        }
        return diff;
    }

    private double predict(double[] input) {
        double linearCombination = bias + IntStream.range(0, input.length).mapToDouble(i -> input[i] * weights[i]).sum();
        if (classification) {
            linearCombination = linearCombination >= 0 ? 1 : 0;
        }
        return linearCombination;
    }

    public double[] getWeights() {
        return weights;
    }
}
