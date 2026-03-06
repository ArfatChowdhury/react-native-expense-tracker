import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Animated,
    Dimensions, StatusBar, TextInput, KeyboardAvoidingView,
    Platform, Vibration, Modal, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useScanBarcodes, BarcodeType, useCameraDevices, Camera } from 'natscan';
import { useContext } from 'react';
import { AppContext } from '../Contex/ContextApi';

const { width: W, height: H } = Dimensions.get('window');
const FRAME_SIZE = W * 0.72;
const CORNER = 22;
const BORDER_W = 3;

// ─── Corner bracket component ──────────────────────────────────────────────
const CornerBracket = ({ position }) => {
    const isTop = position.includes('top');
    const isLeft = position.includes('left');
    return (
        <View style={[
            cornerStyles.corner,
            isTop ? { top: 0 } : { bottom: 0 },
            isLeft ? { left: 0 } : { right: 0 },
        ]}>
            {/* Horizontal arm */}
            <View style={[
                cornerStyles.arm,
                cornerStyles.horizontal,
                isTop ? { top: 0 } : { bottom: 0 },
                isLeft ? { left: 0 } : { right: 0 },
            ]} />
            {/* Vertical arm */}
            <View style={[
                cornerStyles.arm,
                cornerStyles.vertical,
                isTop ? { top: 0 } : { bottom: 0 },
                isLeft ? { left: 0 } : { right: 0 },
            ]} />
        </View>
    );
};

const cornerStyles = StyleSheet.create({
    corner: { position: 'absolute', width: CORNER + BORDER_W, height: CORNER + BORDER_W },
    arm: { position: 'absolute', backgroundColor: '#22C55E' },
    horizontal: { height: BORDER_W, width: CORNER + BORDER_W },
    vertical: { width: BORDER_W, height: CORNER + BORDER_W },
});

// ─── Result bottom sheet ───────────────────────────────────────────────────
const ResultSheet = ({ result, onAddExpense, onDismiss, currencySymbol }) => {
    const slideAnim = useRef(new Animated.Value(300)).current;
    const [manualAmount, setManualAmount] = useState(result?.amount || '');
    const [manualTitle, setManualTitle] = useState(result?.title || result?.raw || '');

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 0, damping: 18, stiffness: 200, useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={sheetStyles.backdrop}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />
            <Animated.View style={[sheetStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                {/* Handle */}
                <View style={sheetStyles.handle} />

                <View style={sheetStyles.scanBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                    <Text style={sheetStyles.scanBadgeText}>Code Scanned!</Text>
                </View>

                <Text style={sheetStyles.sheetTitle}>Add as Expense?</Text>
                <Text style={sheetStyles.sheetSub}>Review and edit details before saving</Text>

                {/* Raw code preview */}
                <View style={sheetStyles.rawBox}>
                    <Ionicons name="barcode-outline" size={16} color="#6B7280" />
                    <Text style={sheetStyles.rawText} numberOfLines={1}>{result?.raw}</Text>
                </View>

                {/* Editable fields */}
                <View style={sheetStyles.fieldGroup}>
                    <Text style={sheetStyles.fieldLabel}>TITLE</Text>
                    <TextInput
                        style={sheetStyles.fieldInput}
                        value={manualTitle}
                        onChangeText={setManualTitle}
                        placeholder="e.g. Coffee, Grocery..."
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={sheetStyles.fieldGroup}>
                    <Text style={sheetStyles.fieldLabel}>AMOUNT ({currencySymbol})</Text>
                    <View style={sheetStyles.amountRow}>
                        <Text style={sheetStyles.currencyTag}>{currencySymbol}</Text>
                        <TextInput
                            style={[sheetStyles.fieldInput, { flex: 1 }]}
                            value={manualAmount}
                            onChangeText={setManualAmount}
                            placeholder="0.00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={sheetStyles.addBtn}
                    onPress={() => onAddExpense({ title: manualTitle, amount: manualAmount })}
                    activeOpacity={0.85}
                >
                    <LinearGradient colors={['#16a34a', '#22C55E']} style={sheetStyles.addBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                        <Ionicons name="add-circle-outline" size={22} color="white" />
                        <Text style={sheetStyles.addBtnText}>Add as Expense</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={sheetStyles.dismissBtn} onPress={onDismiss}>
                    <Text style={sheetStyles.dismissText}>Cancel — Keep Scanning</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const sheetStyles = StyleSheet.create({
    backdrop: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    sheet: {
        backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32,
        padding: 28, paddingBottom: 40,
        shadowColor: '#000', shadowOffset: { width: 0, height: -8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 30,
    },
    handle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
    scanBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDF4', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 16, borderWidth: 1, borderColor: '#BBF7D0' },
    scanBadgeText: { color: '#16a34a', fontWeight: '700', fontSize: 13 },
    sheetTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 4 },
    sheetSub: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 20 },
    rawBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F9FAFB', borderRadius: 12, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E5E7EB' },
    rawText: { flex: 1, fontSize: 12, color: '#9CA3AF', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    fieldGroup: { marginBottom: 16 },
    fieldLabel: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
    fieldInput: { backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 16, padding: 16, fontSize: 16, fontWeight: '600', color: '#111827' },
    amountRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    currencyTag: { fontSize: 22, fontWeight: '900', color: '#111827' },
    addBtn: { borderRadius: 20, overflow: 'hidden', marginTop: 8, marginBottom: 12 },
    addBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 18 },
    addBtnText: { color: 'white', fontSize: 17, fontWeight: '900' },
    dismissBtn: { alignItems: 'center', paddingVertical: 8 },
    dismissText: { color: '#9CA3AF', fontSize: 15, fontWeight: '600' },
});

// ─── Main ScannerScreen ────────────────────────────────────────────────────
const ScannerScreen = ({ navigation, route }) => {
    const { currencySymbol, categoriesList, setTitle, setAmount, setCategory } = useContext(AppContext);

    const [hasPermission, setHasPermission] = useState(null);
    const [torchOn, setTorchOn] = useState(false);
    const [scannedResult, setScannedResult] = useState(null);
    const [isSheetVisible, setIsSheetVisible] = useState(false);
    const [scanCount, setScanCount] = useState(0);
    const [manualCode, setManualCode] = useState('');
    const [showManual, setShowManual] = useState(false);
    const scanLockRef = useRef(false);

    const scanLineAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const frameAnim = useRef(new Animated.Value(0)).current;

    const devices = useCameraDevices();
    const device = devices.back;

    const [frameProcessor, barcodes] = useScanBarcodes([
        BarcodeType.QR,
        BarcodeType.EAN13,
        BarcodeType.EAN8,
        BarcodeType.CODE128,
        BarcodeType.CODE39,
        BarcodeType.UPC_A,
        BarcodeType.UPC_E,
        BarcodeType.PDF417,
        BarcodeType.DATA_MATRIX,
    ], { checkInverted: true });

    // Animations
    useEffect(() => {
        // Scan line bounce
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        // Frame entrance
        Animated.spring(frameAnim, { toValue: 1, damping: 14, stiffness: 150, useNativeDriver: true }).start();
    }, []);

    // Permissions
    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'authorized' || status === 'granted');
        })();
    }, []);

    // Handle scanned barcode
    useEffect(() => {
        if (barcodes.length > 0 && !scanLockRef.current && !isSheetVisible) {
            const code = barcodes[0];
            processCode(code.rawValue || code.displayValue);
        }
    }, [barcodes]);

    const processCode = useCallback((rawValue) => {
        if (!rawValue || scanLockRef.current) return;
        scanLockRef.current = true;

        Vibration.vibrate(80);
        setScanCount(c => c + 1);

        // Pulse animation on success
        Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();

        // Try to parse JSON from QR codes
        let parsed = { title: '', amount: '', raw: rawValue };
        try {
            const json = JSON.parse(rawValue);
            parsed.title = json.title || json.name || json.product || json.item || '';
            parsed.amount = String(json.amount || json.price || json.cost || '');
        } catch {
            // Plain text / barcode — use as title hint
            parsed.title = rawValue.length < 50 ? rawValue : '';
        }

        setScannedResult(parsed);
        setIsSheetVisible(true);
    }, [isSheetVisible]);

    const handleManualEntry = () => {
        if (!manualCode.trim()) return;
        processCode(manualCode.trim());
        setShowManual(false);
        setManualCode('');
    };

    const handleAddExpense = ({ title, amount }) => {
        // Pre-fill the Create screen context
        setTitle(title || '');
        setAmount(amount || '');

        // Auto-suggest category based on title
        const lower = (title || '').toLowerCase();
        const match = categoriesList?.find(c => lower.includes(c.name.toLowerCase()));
        if (match) setCategory(match);

        setIsSheetVisible(false);
        scanLockRef.current = false;

        // Navigate to Create tab — pass fromScanner flag so Create shows scanned badge
        navigation.navigate('BottomTabs', {
            screen: 'Create',
            params: { fromScanner: Date.now() }, // unique stamp forces useEffect to re-fire
        });
    };

    const handleDismiss = () => {
        setIsSheetVisible(false);
        setScannedResult(null);
        setTimeout(() => { scanLockRef.current = false; }, 1200);
    };

    // ─── Permission denied ───────────────────────────────────
    if (hasPermission === false) {
        return (
            <View style={permStyles.container}>
                <StatusBar barStyle="light-content" />
                <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFill} />
                <Ionicons name="camera-off-outline" size={64} color="#4B5563" />
                <Text style={permStyles.title}>Camera Access Required</Text>
                <Text style={permStyles.sub}>Please enable camera permissions in your device settings to use the scanner.</Text>
                <TouchableOpacity style={permStyles.btn} onPress={() => navigation.goBack()}>
                    <Text style={permStyles.btnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ─── Device not ready ─────────────────────────────────────
    if (!device) {
        return (
            <View style={permStyles.container}>
                <StatusBar barStyle="light-content" />
                <LinearGradient colors={['#0F172A', '#1E293B']} style={StyleSheet.absoluteFill} />
                <Ionicons name="camera-outline" size={64} color="#4B5563" />
                <Text style={permStyles.title}>Initializing Camera…</Text>
            </View>
        );
    }

    const scanLineY = scanLineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, FRAME_SIZE - 4] });

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Full-screen camera */}
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={!isSheetVisible}
                frameProcessor={frameProcessor}
                frameProcessorFps={5}
                torch={torchOn ? 'on' : 'off'}
            />

            {/* Dark overlay — 4 rectangles masking outside the frame */}
            <View style={overlay.topMask} />
            <View style={overlay.bottomMask} />
            <View style={[overlay.sideMask, { left: 0 }]} />
            <View style={[overlay.sideMask, { right: 0 }]} />

            {/* Scan frame */}
            <Animated.View style={[
                scanFrame.frame,
                { transform: [{ scale: pulseAnim }, { scale: frameAnim }] }
            ]}>
                <CornerBracket position="top-left" />
                <CornerBracket position="top-right" />
                <CornerBracket position="bottom-left" />
                <CornerBracket position="bottom-right" />

                {/* Animated scan line */}
                <Animated.View style={[scanFrame.scanLine, { transform: [{ translateY: scanLineY }] }]} />
            </Animated.View>

            {/* Header */}
            <SafeAreaView style={headerStyle.safe}>
                <View style={headerStyle.row}>
                    <TouchableOpacity style={headerStyle.iconBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="close" size={22} color="white" />
                    </TouchableOpacity>
                    <View>
                        <Text style={headerStyle.title}>Scan to Add</Text>
                        {scanCount > 0 && <Text style={headerStyle.sub}>{scanCount} scan{scanCount > 1 ? 's' : ''} detected</Text>}
                    </View>
                    <TouchableOpacity style={headerStyle.iconBtn} onPress={() => setTorchOn(t => !t)}>
                        <Ionicons name={torchOn ? 'flash' : 'flash-off'} size={22} color={torchOn ? '#FCD34D' : 'white'} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Instructions below frame */}
            <View style={instrStyle.container}>
                <Text style={instrStyle.main}>Point at a QR code or barcode</Text>
                <Text style={instrStyle.sub}>QR · EAN · CODE128 · UPC · PDF417 supported</Text>

                <View style={instrStyle.btnRow}>
                    {/* Manual entry */}
                    <TouchableOpacity style={instrStyle.manualBtn} onPress={() => setShowManual(v => !v)}>
                        <Ionicons name="pencil-outline" size={16} color="white" />
                        <Text style={instrStyle.manualText}>Enter Manually</Text>
                    </TouchableOpacity>
                </View>

                {/* Manual code input */}
                {showManual && (
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <View style={instrStyle.inputRow}>
                            <TextInput
                                style={instrStyle.input}
                                value={manualCode}
                                onChangeText={setManualCode}
                                placeholder="Type code or product name…"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleManualEntry}
                            />
                            <TouchableOpacity style={instrStyle.inputBtn} onPress={handleManualEntry}>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                )}
            </View>

            {/* Result Bottom Sheet */}
            {isSheetVisible && scannedResult && (
                <ResultSheet
                    result={scannedResult}
                    onAddExpense={handleAddExpense}
                    onDismiss={handleDismiss}
                    currencySymbol={currencySymbol}
                />
            )}
        </View>
    );
};

// ─── Overlay masks ─────────────────────────────────────────────────────────
const SIDE_WIDTH = (W - FRAME_SIZE) / 2;
const TOP_HEIGHT = (H - FRAME_SIZE) / 2 - 20;

const overlay = StyleSheet.create({
    topMask: { position: 'absolute', top: 0, left: 0, width: W, height: TOP_HEIGHT, backgroundColor: 'rgba(0,0,0,0.65)' },
    bottomMask: { position: 'absolute', top: TOP_HEIGHT + FRAME_SIZE, left: 0, width: W, bottom: 0, backgroundColor: 'rgba(0,0,0,0.65)' },
    sideMask: { position: 'absolute', top: TOP_HEIGHT, width: SIDE_WIDTH, height: FRAME_SIZE, backgroundColor: 'rgba(0,0,0,0.65)' },
});

// ─── Scan frame ────────────────────────────────────────────────────────────
const scanFrame = StyleSheet.create({
    frame: {
        position: 'absolute',
        top: TOP_HEIGHT,
        left: SIDE_WIDTH,
        width: FRAME_SIZE,
        height: FRAME_SIZE,
        overflow: 'hidden',
    },
    scanLine: {
        position: 'absolute',
        left: 8,
        right: 8,
        height: 2,
        borderRadius: 2,
        backgroundColor: '#22C55E',
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 5,
    },
});

// ─── Header ────────────────────────────────────────────────────────────────
const headerStyle = StyleSheet.create({
    safe: { position: 'absolute', top: 0, left: 0, right: 0 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
    iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    title: { color: 'white', fontSize: 18, fontWeight: '800', textAlign: 'center' },
    sub: { color: '#22C55E', fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 2 },
});

// ─── Instructions ──────────────────────────────────────────────────────────
const instrStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 60,
        left: 0, right: 0,
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    main: { color: 'white', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
    sub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textAlign: 'center', marginBottom: 20 },
    btnRow: { flexDirection: 'row', gap: 12 },
    manualBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 7,
        backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 20, paddingVertical: 12,
        borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    manualText: { color: 'white', fontSize: 14, fontWeight: '700' },
    inputRow: { flexDirection: 'row', marginTop: 16, gap: 10, width: W - 60 },
    input: {
        flex: 1, backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14,
        color: 'white', fontSize: 15, fontWeight: '600',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    inputBtn: {
        width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#22C55E',
    },
});

// ─── Permission screen ─────────────────────────────────────────────────────
const permStyles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    title: { color: 'white', fontSize: 22, fontWeight: '800', marginTop: 20, marginBottom: 10, textAlign: 'center' },
    sub: { color: '#6B7280', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
    btn: { backgroundColor: '#22C55E', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 18 },
    btnText: { color: 'white', fontSize: 16, fontWeight: '800' },
});

export default ScannerScreen;
